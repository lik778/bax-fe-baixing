
<template>
  <div class="qwt-keyword-list">
    <el-table row-key="word" :data="rows">
      <el-table-column v-if="selectable" width="40"
        :render-header="renderSwitchAllHeader">
        <template slot-scope="s">
          <el-checkbox :value="wordChecked(s.row)"
            @change="onCheckWord(s.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="word" label="关键词" width="220" />
      <el-table-column v-if="showPropShow"
        prop="show" width="180"
        sortable label="日均搜索指数"
        :render-header="renderWithTip(searchIndexTip)">
      </el-table-column>
      <el-table-column v-if="showPropRanking"
        width="140" label="平均排名" sortable
        :formatter="r => fmtCpcRanking(r.cpcRanking)">
      </el-table-column>
      <el-table-column v-if="showPropStatus"
        label="关键词状态"
        :render-header="renderWithTip(keywordStatusTip)">
        <template slot-scope="s">
          <span class="status">
            <label>
              {{ fmtStatus(s.row) }}
            </label>
            <strong v-if="fmtStatus(s.row) === '审核失败'">
              {{ s.row.extra && s.row.extra.refuseReason || '' }}
            </strong>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="电脑端最高出价(元/次点击)"
        :render-header="renderWithTip(cpcTopPriceTip)">
        <template slot-scope="s">
          <span class="price">
            <el-input size="mini" placeholder="单位: 元"
              :value="getWordPrice(s.row.word)"
              @change="v => setCustomPrice(s.row, v)">
            </el-input>
            <span v-if="s.row.cpcRanking >= 5"
              class="add-w-price">
              <button @click="setCustomPrice(s.row, getWordPrice(s.row.word) * 1.2)">
                提价20%
              </button>
              <label>获得更高排名</label>
            </span>
            <label v-if="!isValidPrice(s.row)">
              {{ getPriceTip(s.row) }}
            </label>
          </span>
        </template>
      </el-table-column>
      <el-table-column v-if="deletable" label="操作" width="80">
        <template slot-scope="s">
          <el-button size="mini" type="danger"
            @click="deleteWord(s.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <bax-pagination :options="pagination"
      @current-change="onCurrentChange">
    </bax-pagination>
  </div>
</template>

<script>
import BaxPagination from 'com/common/pagination'

import {
  KEYWORD_STATUS_REFUSE,
  KEYWORD_CHIBI_PENDING,
  KEYWORD_CHIBI_REJECT,
  keywordStatus
} from 'constant/fengming'

import {
  keywordStatusTip,
  cpcTopPriceTip,
  searchIndexTip
} from 'constant/tip'

import {
  fmtCpcRanking
} from 'util/campaign'

import {
  renderColumnHeaderWithTip
} from 'util/element'

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

const TRIGGER_WORDS_CHANGED = 1
const TRIGGER_PAGE_CHANGED = 2
const MODE_SELECT = 'select'
const MODE_UPDATE = 'update'
const LIMIT = 20

export default {
  name: 'qwt-keyword-list',
  components: {
    BaxPagination
  },
  props: {
    mode: {
      type: String,
      required: true,
      validator: v => {
        return [MODE_SELECT, MODE_UPDATE].includes(v)
      }
    },
    words: {
      type: Array,
      required: true
    },
    selectedWords: {
      type: Array,
      default: () => []
    },
    offset: {
      type: Number,
      required: true
    },
    selectable: {
      type: Boolean,
      default: true
    },
    deletable: {
      type: Boolean,
      default: false
    },
    campaignOffline: {
      type: Boolean,
      default: false
    },
    showPropShow: {
      type: Boolean,
      default: true
    },
    showPropStatus: {
      type: Boolean,
      default: false
    },
    showPropRanking: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      stopAutoSelectWords: false,
      preWordsLength: 0,
      curWordsLength: 0,
      prePage: 0,

      customPrices: [],
      userOperatedPages: [], // 用户操作过的页: 0, 1, 2

      keywordStatusTip,
      searchIndexTip,
      cpcTopPriceTip
    }
  },
  computed: {
    isCurrentHasChecked() {
      // 有选中
      const cids = this.rows.map(r => r.id)
      const sids = this.selectedWords.map(r => r.id)

      if (!cids.length) {
        return false
      }

      let yes = false

      for (const i of cids) {
        if (sids.includes(i)) {
          yes = true
          break
        }
      }

      return yes
    },
    isCurrentAllChecked() {
      // 全部选中
      const cids = this.rows.map(r => r.id)
      const sids = this.selectedWords.map(r => r.id)

      if (!sids.length) {
        return false
      }

      let yes = true

      for (const i of cids) {
        if (!sids.includes(i)) {
          yes = false
          break
        }
      }

      return yes
    },
    currentPage() {
      return this.offset / LIMIT | 0 // 0, 1, 2
    },
    pagination() {
      return {
        limit: LIMIT,
        offset: this.offset,
        total: this.words.length
      }
    },
    rows() {
      const { currentPage } = this
      const start = currentPage * LIMIT
      return this.words.slice(start, start + LIMIT)
    }
  },
  methods: {
    renderSwitchAllHeader(h) {
      const checked = this.isCurrentHasChecked
      const cids = this.rows.map(r => r.id)

      return h('el-checkbox', {
        props: {
          value: checked
        },
        on: {
          change: () => {
            if (checked) {
              // 取消
              const words = this.selectedWords
                .filter(r => !cids.includes(r.word))
              this.stopAutoSelectWords = true
              this.$emit('select-words', words)
            } else {
              // all
              this.mergeSelectedWords(this.rows)
            }
          }
        }
      })
    },
    renderWithTip: renderColumnHeaderWithTip,
    onCurrentChange({offset}) {
      this.$emit('change-offset', offset)
      setTimeout(() => this.tryAutoSelectWords(TRIGGER_PAGE_CHANGED), 5)
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

      const p = this.words.find(w => w.word === word).price
      if (this.mode === 'update') {
        return centToYuan(p)
      }

      if (p < 3000) {
        return centToYuan(p * 1.5)
      }

      return centToYuan(p)
    },
    isValidPrice(row) {
      // 说明: TODO 这里需要优化
      //   1. 新增关键词: words -> 直接取自 server (price === originPrice)
      //     此时 word 没有 prop originPrice
      //   2. 更新关键词: words -> 原有关键词 + 更新价格 (price !== originPrice)
      //     此时 word 存在 prop originPrice
      const p = this.getWordPrice(row.word) * 100 | 0
      // const o = row.originPrice || row.price
      const o = 200

      if (p * 2 < o) {
        return false
      }

      return true
    },
    getPriceTip(row) {
      // const o = row.originPrice || row.price
      // return `该关键词出价最低为: ${(o / 200).toFixed(2)}, 请调高出价`
      return '该关键词出价最低为: 1元, 请调高出价'
    },
    hasCustomPrice(word) {
      return this.customPrices.findIndex(c => c.word === word) !== -1
    },
    tryAutoSelectWords(trigger) {
      const { currentPage, prePage, offset, mode } = this

      if (mode === MODE_UPDATE) {
        return
      }

      if (this.stopAutoSelectWords) {
        return
      }

      // console.debug('op pages', this.userOperatedPages,
      //   'pre words length', this.preWordsLength,
      //   'cur words length', this.curWordsLength,
      //   'pre page', prePage,
      //   'page', currentPage,
      //   'offset', offset, 'limit', LIMIT,
      //   'rows', this.rows.map(w => w.word))
      if (!this.userOperatedPages.includes(currentPage)) {
        // 1. 用户未操作过当前页
        this.mergeSelectedWords(this.rows)
        return
      }

      // 2. 用户操作过当前页
      if (trigger === TRIGGER_WORDS_CHANGED) {
        if (prePage < currentPage) {
          // 2.1 先前页 < 当前页, 新增词
          const start = this.preWordsLength % LIMIT
          this.mergeSelectedWords(this.rows.slice(start, LIMIT))
        } else if (prePage === currentPage) {
          // 2.2 先前页 == 当前页, 新增词
          const start = offset % LIMIT
          // console.debug('start', start)
          this.mergeSelectedWords(this.rows.slice(start, LIMIT))
        } else {
          // 2.3 不可能
        }
      }
    },
    wordChecked(word) {
      return this.selectedWords
        .map(w => w.word)
        .includes(word.word)
    },
    onCheckWord(word) {
      if (!this.userOperatedPages.includes(this.currentPage)) {
        this.userOperatedPages.push(this.currentPage)
      }

      if (this.wordChecked(word)) {
        const words = this.selectedWords
          .filter(w => w.word !== word.word)
        this.$emit('select-words', words)
      } else {
        const words = [...this.selectedWords, this.fmtWord(word)]
        this.$emit('select-words', words)
      }
    },
    mergeSelectedWords(rows) {
      // console.debug('merge words', rows.map(w => w.word))
      const preSelectedWords = this.selectedWords
      const ws = preSelectedWords.map(w => w.word)
      const newSelectedWords = rows
        .map(this.fmtWord)
        .filter(w => !ws.includes(w.word))

      const selectedWords = [
        ...preSelectedWords,
        ...newSelectedWords
      ]

      console.debug('emit event: select-words',
        selectedWords.map(w => w.word))
      this.$emit('select-words', selectedWords)
    },
    setCustomPrice({price: originPrice, word, id}, v) {
      let price = v ? toFloat(v) : 0

      if (this.hasCustomPrice(word)) {
        this.customPrices = this.customPrices.map(c => {
          if (c.word === word) {
            return {
              word: c.word,
              price
            }
          } else {
            return {...c}
          }
        })
      } else {
        this.customPrices = [...this.customPrices, {
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
    fmtStatus(row) {
      const { chibiStatus, status } = row

      if (this.campaignOffline) {
        return '-'
      }

      if (chibiStatus === KEYWORD_CHIBI_REJECT ||
        status === KEYWORD_STATUS_REFUSE) {
        return '审核失败'
      }

      if (chibiStatus === KEYWORD_CHIBI_PENDING) {
        return '等待审核'
      }

      return keywordStatus[String(status)] || '未知'
    },
    fmtWord(w) {
      return {
        price: this.getWordPrice(w.word) * 100 | 0,
        recommandSource: w.recommandSource,
        originPrice: w.price,
        word: w.word,
        id: w.id
      }
    },
    fmtCpcRanking
  },
  watch: {
    currentPage(val, pre) {
      if (val !== this.prePage) {
        this.prePage = pre
      }
    },
    words(v) {
      console.debug('words changed')
      if (v && v.length && v.length > this.curWordsLength) {
        this.preWordsLength = this.curWordsLength
        this.curWordsLength = v.length
      }
      setTimeout(() => this.tryAutoSelectWords(TRIGGER_WORDS_CHANGED), 10)
    }
  }
}
</script>

<style scoped>
.qwt-keyword-list {
  display: flex;
  flex-flow: column;
  max-width: 1120px;
}

.add-w-price {
  display: inline-flex;
  padding: 0 5px;
  font-size: 11px;
  color: #67c23a;

  & > button {
    width: 60px;
    height: 20px;
    margin-right: 5px;
    background: rgba(103, 194, 58, 0.1);
    font-size: 11px;
    border-radius: 4px;
    border: 1px solid rgba(103, 194, 58, 0.2);
    color: #67c23a;
    cursor: pointer;
  }
}

.status {
  display: flex;
  align-items: center;

  & > strong {
    max-width: 96px;
    margin-left: 3px;
    color: red;
    font-size: 10px;
    line-height: 14px;
  }
}

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
