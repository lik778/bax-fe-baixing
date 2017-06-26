
<template>
  <div>
    <el-table :data="words" style="width: 860px"
      @selection-change="onSelectionChange">
      <el-table-column v-if="selectable" type="selection" width="40">
      </el-table-column>
      <el-table-column prop="word" label="关键词" width="420">
      </el-table-column>
      <el-table-column prop="show" label="日均搜索指数">
      </el-table-column>
      <el-table-column label="CPC最高出价 (元/次点击)" width="200">
        <template scope="s">
          <el-input v-if="wordPriceEditable(s.row.word)"
            size="mini" placeholder="单位: 元"
            :value="getWordPrice[s.row.word]"
            @blur="e => setCustomPrice(s.row.word, e.target.value, false)">
          </el-input>
          <label v-else
            @click="setCustomPrice(s.row.word, s.row.price / 100, true)">
            {{ getWordPrice(s.row.word) }}
          </label>
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

function centToYuan(s) {
  return toFloat(s) / 100
}

function toFloat(s) {
  const i = parseFloat(s).toFixed(2)

  if (i === 'NaN') {
    return 1
  }

  const n = parseFloat(i)

  if (n <= 0) {
    return 1
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
    }
    // selectedWords: {
    //   type: Array,
    //   required: true
    // }
  },
  data() {
    return {
      selectedWords: [],
      customPrices: []
    }
  },
  methods: {
    // setRowSelection() {
    //   this.words.forEach((row) => {
    //     const selected = this.selectedWords.includes(row.word)
    //     this.$refs.table.toggleRowSelection(row, selected)
    //   })
    // },
    deleteWord(row) {
      this.$emit('delete-word', {...row})
    },
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
      const words = rows.map(r => ({
        price: this.getWordPrice(r.word) * 100 | 0,
        word: r.word
      }))

      this.selectedWords = [...words]
      this.$emit('select-words', words)
    },
    setCustomPrice(word, v, editable) {
      let price = v ? toFloat(v) : this.getWordPrice(word)
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

      this.$emit('update-word', {
        price: price * 100 | 0,
        word
      })
    },
    centToYuan
  }
  // watch: {
  //   'selectedWords': function() {
  //     this.setRowSelection()
  //   }
  // }
}

</script>
