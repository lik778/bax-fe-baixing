
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
      <el-table-column label="关键词" width="220">
        <template slot-scope="{row}">
          {{row.word}}
          <span class="new-word" v-if="row.isNew">(新)</span>
          <span class="new-word">
            {{RECOMMAND_SOURCES.includes(row.recommandSource) ? '(好词)': ''}}
          </span>
        </template>
      </el-table-column>
      <el-table-column v-if="showPropShow"
        prop="show" width="200"
        label="日均搜索指数"
        :render-header="renderWithTip(searchIndexTip)">
      </el-table-column>
      <el-table-column v-if="showPropRanking"
        width="150" label="电脑端排名"
        :formatter="r => fmtCpcRanking(r.cpcRanking || -1)">
      </el-table-column>
      <el-table-column v-if="showPropMobileRanking"
        width="150" label="手机端排名"
        :formatter="r => fmtCpcRanking(r.mobileCpcRanking || -1)">
      </el-table-column>
      <el-table-column v-if="showPropStatus"
        width="180"
        label="关键词状态"
        :render-header="renderWithTip(keywordStatusTip)">
        <template slot-scope="s">
          <span class="status">
            <label>
              {{ fmtStatus(s.row) }}
            </label>
            <strong v-if="fmtStatus(s.row) === '审核失败'">
              {{ getRefuseReason(s.row) }}
            </strong>
          </span>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot="header" slot-scope="col">
          {{maxPriceLabel}}<cpc-top-price-tip/>
          <div style="display:block;padding-left:0">
           <el-popover placement="top" v-model="popoverVisible">
            <div>
              <el-input placeholder="请输入关键词价格" v-model="keywordPrice" size="mini"></el-input>
              <div class="actions">
                <el-button size="mini" @click="popoverVisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="handleKeywordsPriceChange">确定</el-button>
              </div>
            </div>
            <a href="javascript:;" slot="reference" class="pcice-action">批量改价</a>
           </el-popover>
          </div>
        </template>
        <template slot-scope="s">
          <span class="price">
            <bax-input placeholder="单位，元" 
                       :value="f2y(getWordPrice(s.row.word))"
                       @blur="v => setCustomPrice(s.row, v)"
                       @keyup="v => setCustomPrice(s.row, v)" />
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
import Vue from 'vue'
import BaxPagination from 'com/common/pagination'

import {
  KEYWORD_STATUS_ONLINE,
  KEYWORD_STATUS_REFUSE,
  KEYWORD_CHIBI_PENDING,
  KEYWORD_CHIBI_REJECT,
  SEM_PLATFORM_SHENMA,
  keywordStatus,
  RECOMMAND_SOURCE_FH,
  NEW_RECOMMAND_SOURCE_FH
} from 'constant/fengming'

import BaxInput from 'com/common/bax-input'

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

import { f2y } from 'util'
import track from 'util/track'
import { toFloat } from 'util/kit'

const CpcTopPriceTip = Vue.extend({
  render(h) {
    return renderColumnHeaderWithTip(cpcTopPriceTip)(h, 
    {column: {},labelStyle:{display:'none'}, wrapClass:'display-inline'})
  }
})
const MODE_SELECT = 'select'
const MODE_UPDATE = 'update'
const LIMIT = 10

const RECOMMAND_SOURCES = [NEW_RECOMMAND_SOURCE_FH, RECOMMAND_SOURCE_FH]

export default {
  name: 'qwt-keyword-list',
  components: {
    BaxPagination,
    CpcTopPriceTip,
    BaxInput
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
    },
    showPropMobileRanking: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      preWordsLength: 0,
      curWordsLength: 0,
      prePage: 0,

      userOperatedPages: [], // 用户操作过的页: 0, 1, 2

      keywordStatusTip,
      searchIndexTip,
      cpcTopPriceTip,
      keywordPriceTip,

      keywordPrice: '',
      popoverVisible: false,

      RECOMMAND_SOURCES
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
    getRefuseReason(word) {
      const {refuseReason} = word.extra
      return (
        typeof refuseReason === 'string'
        ? refuseReason
        : refuseReason.message
        ) || '审核驳回'
    },
    async handleKeywordsPriceChange() {
      const keywordPrice = this.keywordPrice.trim()
      if (!keywordPrice) return
      try {
        const res = await this.$parent.changeKeywordsPrice(keywordPrice)
        this.$message.success(res)
        this.popoverVisible = false
        this.keywordPrice = ''
      } catch(err) {
        console.log(err)
        this.$message.error(err)
      }
    },
    f2y(price) {
      return (price / 100).toFixed(2)
    },
    showAddPrice(row) {
      // 过去24小时排名低于5或无排名的，在线的 keyword，在线的 campaign
      const {cpcRanking, mobileCpcRanking, isPriceChanged, status: keywordStatus} = row
      // 电脑端和手机端任意一端排名大于5或者无排名
      let rankingLow = false
      if (this.platform === SEM_PLATFORM_SHENMA) {
        rankingLow = mobileCpcRanking > 5 || mobileCpcRanking <= 0
      } else {
        rankingLow = (cpcRanking > 5 || cpcRanking <= 0) || (mobileCpcRanking > 5 || mobileCpcRanking <= 0)
      }
      const show = keywordStatus === KEYWORD_STATUS_ONLINE && this.campaignOnline && !isPriceChanged && rankingLow
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
        isNew:  row.isNew,
        price: row.price,
        word: row.word,
        id: row.id
      })
      this.$emit('change-offset', this.offset - 1)
    },
    getWordPrice(kw) {
      const word = this.words.find(w => w.word === kw)
      return word.price
    },
    isValidPrice(row) {
      const finalPrice = this.getWordPrice(row.word)
      return finalPrice >= MIN_WORD_PRICE && finalPrice <= MAX_WORD_PRICE
    },
    wordChecked(word) {
      return this.selectedWords
        .map(w => w.word)
        .includes(word.word)
    },
    onCheckWord(word) {
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
    setCustomPrice({serverPrice, word, id}, v) {
      let price = (v ? toFloat(v) : 0) * 100
      this.$emit('update-word', {
        price,
        serverPrice,
        word,
        id
      })
    },
    bumpPriceBy20(row) {
      track({
        action: 'click-button: bump-price-by-20'
      })
      this.setCustomPrice(row, f2y(this.getWordPrice(row.word)) * 1.2)
    },
    fmtStatus(row) {
      if (this.campaignOffline) {
        return '-'
      }

      return keywordStatus[String(row.status)] || '未知'
    },
    fmtWord(w) {
      return {
        price: this.getWordPrice(w.word),
        recommandSource: w.recommandSource,
        serverPrice: w.serverPrice,
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
      if (!this.userOperatedPages.includes(val)) {
        this.userOperatedPages.push(val)
        this.$emit('operated-pages', this.userOperatedPages)
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

<style lang="postcss" scoped>
@import "../../cssbase/var.css";
.qwt-keyword-list {
  display: flex;
  flex-flow: column;
  max-width: 1150px;

  & >>> .new-word {]
    font-size: 12px;
    color: #ff4401;
  }

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
    white-space: nowrap;
  }

  & > label {
    white-space: nowrap;
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
    max-width: 180px;
  }
}

.pcice-action {
  font-size: 13px;
  font-weight: 300;
  color: var(--qwt-c-orange);
}

.actions {
  margin-top:  8px;
  display: flex;
  justify-content: flex-end;
  & .el-button {
    margin-left: 6px;
  }
}

.display-inline{
  display: inline-block !important;
  vertical-align: middle !important;
  line-height: 20px;
}
</style>
