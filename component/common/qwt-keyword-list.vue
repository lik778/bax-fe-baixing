
<template>
  <div class="qwt-keyword-list">
    <div v-if="selectable && selectedWords.length" class="cart">
      <p>当前累计选中关键词数：<strong> {{ selectedWords.length }} </strong>个</p>
      <p>{{simpleShoppingCart}}</p>
    </div>

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
      <el-table-column
        :label="maxPriceLabel"
        :render-header="renderWithTip(cpcTopPriceTip)"
      >
        <template slot-scope="s">
          <span class="price">
            <el-input size="mini" placeholder="单位: 元"
              :value="centToYuan(getWordPrice(s.row.word))"
              @change="v => setCustomPrice(s.row, v)">
            </el-input>
            <span v-if="showAddPrice(s.row)"
              class="add-w-price">
              <button @click="bumpPriceBy20(s.row)">
                提价20%
              </button>
              <label>获得更高排名</label>
            </span>
            <label v-if="!isValidPrice(s.row)">
              {{keywordPriceTip}}
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
    <footer>
      <bax-pagination :options="pagination"
        @current-change="onCurrentChange">
      </bax-pagination>
    </footer>
  </div>
</template>

<script>
import BaxPagination from 'com/common/pagination'

import {
  KEYWORD_STATUS_ONLINE,
  KEYWORD_STATUS_REFUSE,
  KEYWORD_CHIBI_PENDING,
  KEYWORD_CHIBI_REJECT,
  SEM_PLATFORM_SHENMA,
  keywordStatus
} from 'constant/fengming'

import {
  keywordStatusTip,
  cpcTopPriceTip,
  searchIndexTip,
  keywordPriceTip
} from 'constant/tip'

import {
  MIN_WORD_PRICE,
  MAX_WORD_PRICE
} from 'constant/keyword'

import {
  fmtCpcRanking
} from 'util/campaign'

import {
  renderColumnHeaderWithTip
} from 'util/element'

import track from 'util/track'

function toFloat(s, f = 2) {
  const i = parseFloat(s).toFixed(f)

  if (i === 'NaN') {
    return 0
  }

  const n = parseFloat(i)

  if (n <= 0) {
    return 0
  }

  return n
}

function centToYuan(string) {
  return toFloat(string, 0) / 100
}

const MODE_SELECT = 'select'
const MODE_UPDATE = 'update'
const LIMIT = 20

export default {
  name: 'qwt-keyword-list',
  components: {
    BaxPagination
  },
  props: {
    platform: {
      type: Number,
      required: true
    },
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
    campaignOnline: {
      type: Boolean,
      default: true
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
      preWordsLength: 0,
      curWordsLength: 0,
      prePage: 0,

      customPrices: [],
      userOperatedPages: [], // 用户操作过的页: 0, 1, 2

      keywordStatusTip,
      searchIndexTip,
      cpcTopPriceTip,
      keywordPriceTip
    }
  },
  computed: {
    simpleShoppingCart() {
      const joined = this.selectedWords.map(item => item.word).join(',')
      return joined.length > 100 ? joined.slice(0, 100) + '...' : joined
    },
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
    maxPriceLabel() {
      if (this.platform === SEM_PLATFORM_SHENMA) {
        return '移动端出价(元/次点击)'
      }

      return '电脑端最高出价(元/次点击)'
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
    centToYuan,
    showAddPrice(row) {
      // 过去24小时排名低于5或无排名的，在线的 keyword，在线的 campaign
      const {cpcRanking, isPriceChanged, status: keywordStatus} = row
      const show = keywordStatus === KEYWORD_STATUS_ONLINE && this.campaignOnline && isPriceChanged && (cpcRanking > 5 || cpcRanking === 0)
      if (show) {
        track({
          action: 'pv: bump-price-by-20'
        })
      }
      return show
    },
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
    },
    deleteWord(row) {
      this.$emit('delete-word', {
        price: row.price,
        word: row.word,
        id: row.id
      })
    },
    getWordPrice(word) {
      const item = this.customPrices.find(c => c.word === word)

      if (item) {
        return item.price
      }

      const p = this.words.find(w => w.word === word).price
      if (this.mode === 'update') {
        return p
      }
      // 前端更改百度推荐出价
      let modified = p
      if (p <= 300) {
        modified *= 3
      } else if (p <= 500) {
        modified *= 2.5
      } else if (p <= 1000) {
        modified *= 2
      } else {
        modified *= 1.5
      }
      return modified > MIN_WORD_PRICE ? modified : MIN_WORD_PRICE
    },
    isValidPrice(row) {
      // 说明: TODO 这里需要优化
      //   1. 新增关键词: words -> 直接取自 server (price === originPrice)
      //     此时 word 没有 prop originPrice
      //   2. 更新关键词: words -> 原有关键词 + 更新价格 (price !== originPrice)
      //     此时 word 存在 prop originPrice
      const finalPrice = this.getWordPrice(row.word)
      return finalPrice >= MIN_WORD_PRICE && finalPrice <= MAX_WORD_PRICE
    },
    hasCustomPrice(word) {
      return this.customPrices.findIndex(c => c.word === word) !== -1
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
      this.$emit('operated-pages', this.userOperatedPages)

      let words = []
      if (this.wordChecked(word)) {
        words = this.selectedWords
          .filter(w => w.word !== word.word)
      } else {
        words = [...this.selectedWords, this.fmtWord(word)]
      }
      this.$emit('select-words', words)
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
      let price = (v ? toFloat(v) : 0) * 100

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
        price,
        originPrice,
        word,
        id
      })
    },
    bumpPriceBy20(row) {
      track({
        action: 'click-button: bump-price-by-20'
      })
      this.setCustomPrice(row, centToYuan(this.getWordPrice(row.word)) * 1.2)
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
        price: this.getWordPrice(w.word),
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
      if (v && v.length && v.length > this.curWordsLength) {
        this.preWordsLength = this.curWordsLength
        this.curWordsLength = v.length
      }
    }
  }
}
</script>

<style scoped>
.qwt-keyword-list {
  display: flex;
  flex-flow: column;
  max-width: 1120px;

  & > .cart {
    margin-top: 10px;
    font-size: 12px;
    color: #717d91;
    & p {
      margin-bottom: 10px;
    }
    & strong {
      color: red;
    }
  }
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
