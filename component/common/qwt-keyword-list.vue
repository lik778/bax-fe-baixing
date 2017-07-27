
<template>
  <div>
    <el-table ref="table" :data="words"
      style="width: 860px" row-key="word"
      @selection-change="onSelectionChange">
      <el-table-column v-if="selectable" type="selection" width="40">
      </el-table-column>
      <el-table-column prop="word" label="关键词" width="240"
        sortable :sort-method="sort">
      </el-table-column>
      <el-table-column v-if="showPropShow" prop="show" width="180"
        sortable label="日均搜索指数">
      </el-table-column>
      <el-table-column v-if="showPropStatus" label="关键词状态"
        :formatter="r => fmtStatus(r.status)">
      </el-table-column>
      <el-table-column label="CPC最高出价 (元/次点击)">
        <template scope="s">
          <span class="price">
            <el-input size="mini" placeholder="单位: 元"
              :value="getWordPrice(s.row.word)"
              @change="v => setCustomPrice(s.row, v, false)">
            </el-input>
            <label v-if="!isValidPrice(s.row)">
              {{ getPriceTip(s.row) }}
            </label>
          </span>
        </template>
      </el-table-column>
      <el-table-column v-if="deletable" label="操作" width="80">
        <template scope="s">
          <el-button size="mini" type="danger"
            @click="deleteWord(s.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import { keywordStatus } from 'constant/fengming'

function centToYuan(s) {
  return toFloat(s) / 100
}

function toFloat(s) {
  const i = parseFloat(s).toFixed(2)

  if (i === 'NaN') {
    return 0
  }

  const n = parseFloat(i)

  if (n <= 0) {
    return 0
  }

  return n
}

export default {
  name: 'qwt-keyword-list',
  props: {
    selectable: {
      type: Boolean,
      default: true
    },
    deletable: {
      type: Boolean,
      default: false
    },
    words: {
      type: Array,
      required: true
    },
    selectedWords: {
      type: Array,
      default: () => []
    },
    showPropShow: {
      type: Boolean,
      default: true
    },
    showPropStatus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      customPrices: []
    }
  },
  methods: {
    setRowSelection(words) {
      this.words.forEach((row) => {
        const selected = words.includes(row.word)
        this.$refs.table.toggleRowSelection(row, selected)
      })
    },
    deleteWord(row) {
      this.$emit('delete-word', {
        price: row.price,
        word: row.word,
        id: row.id
      })
    },
    getWordPrice(word) {
      // return : 元
      const item = this.customPrices.find(c => c.word === word)

      if (item) {
        return item.price
      }

      return centToYuan(this.words.find(w => w.word === word).price)
    },
    isValidPrice(row) {
      // 说明: TODO 这里需要优化
      //   1. 新增关键词: words -> 直接取自 server (price === originPrice)
      //     此时 word 没有 prop originPrice
      //   2. 更新关键词: words -> 原有关键词 + 更新价格 (price !== originPrice)
      //     此时 word 存在 prop originPrice
      const p = this.getWordPrice(row.word) * 100 | 0
      const o = row.originPrice || row.price

      if (p * 2 < o) {
        return false
      }

      return true
    },
    getPriceTip(row) {
      const o = row.originPrice || row.price
      return `该关键词出价最低为: ${(o / 200).toFixed(2)}, 请调高出价`
    },
    wordPriceEditable(word) {
      const item = this.customPrices.find(c => c.word === word)
      return item && item.editable
    },
    hasCustomPrice(word) {
      return this.customPrices.findIndex(c => c.word === word) !== -1
    },
    onSelectionChange(rows) {
      const words = rows.map(r => ({
        price: this.getWordPrice(r.word) * 100 | 0,
        originPrice: r.price,
        word: r.word,
        id: r.id
      }))
      console.debug('emit event: select-words')
      this.$emit('select-words', words)
    },
    setCustomPrice({price: originPrice, word, id}, v, editable) {
      let price = v ? toFloat(v) : 0

      if (this.hasCustomPrice(word)) {
        this.customPrices = this.customPrices.map(c => {
          if (c.word === word) {
            return {
              word: c.word,
              editable,
              price
            }
          } else {
            return {...c}
          }
        })
      } else {
        this.customPrices = [...this.customPrices, {
          editable,
          price,
          word
        }]
      }

      this.$emit('update-word', {
        price: price * 100 | 0,
        originPrice,
        word,
        id
      })
    },
    sort(a, b) {
      const { selectedWords } = this
      const words = selectedWords.map(w => w.word)
      return words.includes(a.word)
    },
    fmtStatus(s) {
      return keywordStatus[String(s)] || '未知'
    },
    centToYuan
  },
  watch: {
    words(v) {
      // TODO: use element table - reserve-selection option
      const selectedWords = this.selectedWords.map(w => w.word)
      /**
       * 说明: element table 在 words 变更后,
       */
      setTimeout(() => {
        this.setRowSelection(selectedWords)
      }, 250)
    }
  }
}

</script>

<style>

.price {
  display: flex;
  align-items: center;

  & > .el-input {
    width: 140px;
  }

  & > label {
    margin-left: 10px;
    font-size: 12px;
    color: red;
  }
}

</style>
