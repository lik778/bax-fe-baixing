
<template>
  <div>
    <el-table :data="words" style="width: 860px"
      @selection-change="onSelectionChange">
      <el-table-column type="selection" width="40">
      </el-table-column>
      <el-table-column prop="word" label="关键词" width="420">
      </el-table-column>
      <el-table-column prop="show" label="日均搜索量">
      </el-table-column>
      <el-table-column label="CPC最高出价 (元/次点击)" width="200">
        <template scope="s">
          <el-input v-if="wordPriceEditable(s.row.word)"
            size="mini" placeholder="单位: 元"
            :value="getWordPrice[s.row.word]"
            @blur="e => setCustomPrice(s.row.word, e.target.value, false)">
          </el-input>
          <label v-else
            @dblclick="setCustomPrice(s.row.word, s.row.price / 100, true)">
            {{ getWordPrice(s.row.word) }}
          </label>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

function centToYuan(s) {
  return toFloat(s) / 100
}

function toFloat(s) {
  const i = parseFloat(s).toFixed(2)
  return parseFloat(i)
}

export default {
  name: 'qwt-keyword-list',
  props: {
    words: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedWords: [],
      customPrices: []
    }
  },
  methods: {
    getWordPrice(word) {
      // return : 元
      const item = this.customPrices.find(c => c.word === word)
      if (item) {
        return item.price
      }

      return centToYuan(this.words.find(w => w.word === word).price)
    },
    wordPriceEditable(word) {
      const item = this.customPrices.find(c => c.word === word)
      return item && item.editable
    },
    hasCustomPrice(word) {
      return this.customPrices.findIndex(c => c.word === word) !== -1
    },
    onSelectionChange(rows) {
      let words = []

      if (rows) {
        // table selection trigger
        words = rows.map(r => ({
          price: this.getWordPrice(r.word) * 100 | 0,
          word: r.word
        }))
      } else {
        // change word price
        words = this.selectedWords.map(w => ({
          price: this.getWordPrice(w.word) * 100 | 0,
          word: w.word
        }))
      }

      this.selectedWords = [...words]
      this.$emit('select-words', words)
    },
    setCustomPrice(word, v, editable) {
      let price = toFloat(v)
      if (price <= 0) {
        price = 1
      }

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

      this.onSelectionChange()
    },
    centToYuan
  }
}

</script>
