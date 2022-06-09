<template>
  <div class="keyword-list">
    <el-table ref="multipleTable" :data="rows" @select-all="selectAll" @selection-change="change" @select="handleSelectionChange">
      <el-table-column
      type="selection"
      width="55" />
      <el-table-column label="关键词"
                       key="word"
                       min-width="140">
        <template slot-scope="{ row }">
          <span>{{ row.word }}</span>
          <span class="new-word"
                v-if="row.isNew">(新)</span>
          <span class="del-word"
                v-if="row.isDel && !row.isRemove">(删除)</span>
          <span class="updated-word"
                v-if="row.isUpdated">(更改)</span>
          <span class="updated-word"
                v-if="row.isRemove">(移动)</span>
          <span class="good-word"
                v-if="RECOMMAND_SOURCES.includes(row.recommandSource)">(好词)</span>
        </template>
      </el-table-column>
      <el-table-column label="电脑端排名"
                       min-width="120px"
                       key="cpcRanking"
                       v-if="showPropRanking"
                       :formatter="(r) => fmtCpcRanking(r.cpcRanking || -1)" />
      <el-table-column label="手机端排名"
                       min-width="120px"
                       key="mobileCpcRanking"
                       :formatter="(r) => fmtCpcRanking(r.mobileCpcRanking || -1)" />
      <el-table-column key="status"
                       min-width="120px">
        <header-tip-comp slot="header"
                         label-html="关键词状态"
                         :tip-html="keywordStatusTip" />
        <div slot-scope="{ row }">
          <el-tooltip v-if="row.status === KEYWORD_CHIBI_REJECT"
                      placement="top"
                      effect="dark"
                      :content="getRefuseReason(row)">
            <span>
              <span style="color: #ff3c3c">{{ fmtStatus(row) }}</span>
              <i class="error el-icon-question pointer" />
            </span>
          </el-tooltip>
          <label v-else>{{ fmtStatus(row) }}</label>
        </div>
      </el-table-column>
      <el-table-column key="price"
                       min-width="220">
        <!-- 删除 slot-scope 后会有稀奇古怪的问题 -->
        <!-- eslint-disable-next-line -->
        <div slot="header" slot-scope="col">
          <header-tip-comp :label-html="maxPriceLabel"
                           :tip-html="cpcTopPriceTip" />
          <el-popover placement="top"
                      v-model="pricePopoverVisible">
            <div>
              <el-input placeholder="请输入关键词价格"
                        v-model="keywordPrice"
                        size="mini" />
              <div class="actions">
                <el-button size="mini"
                           @click="pricePopoverVisible = false">取消
                </el-button>
                <el-button type="primary"
                           size="mini"
                           :loading="loading"
                           @click="changeAllWordPrice">确定
                </el-button>
              </div>
            </div>
            <a href="javascript:;"
               slot="reference"
               class="price-action">批量改价
            </a>
          </el-popover>
        </div>
        <div slot-scope="{ row }">
          <span class="price">
            <bax-input :disabled="row.isDel"
                       placeholder="单位，元"
                       :value="$formatter.f2y(row.price)"
                       @blur="(v) => setCustomPrice(row, v)"
                       @keyup="(v) => setCustomPrice(row, v)" />
            <span v-if="showAddPrice(row)"
                  class="add-w-price">
              <button @click="bumpPriceBy20(row)">提价20%</button>
              <label>获得更高排名</label>
            </span>
            <label v-if="!isValidPrice(row)">{{ keywordPriceTip }}</label>
          </span>
        </div>
      </el-table-column>
      <el-table-column key="matchType"
                       min-width="220"
                       v-if="showMatchType">
        <!-- eslint-disable-next-line -->
        <div slot="header" slot-scope="col">
          <header-tip-comp :label-html="matchTypeLabel"
                           :tip-html="matchTypeTip" />
          <el-popover placement="top"
                      v-model="matchTypePopVisible">
            <div>
              <el-radio-group v-model="matchType"
                              placeholder="请选择匹配模式"
                              size="mini">
                <el-radio class="match-radio"
                          v-for="item in MATCH_TYPE_OPTS.slice(0,MATCH_TYPE_OPTS.length - 1)"
                          :key="item.value"
                          :label="item.value">{{ item.label }}
                </el-radio>
              </el-radio-group>
              <div class="actions">
                <el-button size="mini"
                           @click="matchTypePopVisible = false">取消
                </el-button>
                <el-button type="primary"
                           size="mini"
                           :loading="loading"
                           @click="changeAllMatchType">确定
                </el-button>
              </div>
            </div>
            <a href="javascript:;"
               slot="reference"
               class="price-action">批量修改
            </a>
          </el-popover>
        </div>
        <div slot-scope="{ row }"
             class="match-type">
          <el-select :value="row.matchType"
                     :disabled="row.isDel"
                     placeholder="请选择匹配模式"
                     size="small"
                     class="match-type-select"
                     @change="(v) => emitUpdateKeyword({ ...row, matchType: v })">
            <el-option v-for="item in MATCH_TYPE_OPTS"
                       :key="item.value"
                       :label="item.label"
                       :disabled="String(item.value) === String(MATCH_TYPE_EXACT) && matchTypeRemainExactCount <= 0"
                       :value="item.value" />
          </el-select>
        </div>
      </el-table-column>
      <el-table-column label="操作"
                       key="deletable">
        <div slot-scope="{ row }">
          <el-button type="danger"
                     size="mini"
                     v-if="!row.isDel"
                     @click="deleteWord(row)">删除
          </el-button>
          <el-button v-else
                     type="success"
                     size="mini"
                     plain
                     @click="resumeWord(row)">恢复
          </el-button>
        </div>
      </el-table-column>
    </el-table>
    <footer>
      <p class="opration-item">
        <el-button type="primary" @click="batchDelet" size="mini">批量删除</el-button>
        <el-button type="primary" size="mini" @click="batchRemove">批量移动</el-button>
        <el-button type="primary" size="mini" @click="patchChangePrice">批量改价</el-button>
        <el-button type="primary" @click="batchCopy" size="mini">批量复制</el-button>
      </p>
      <bax-pagination :options="pagination"
                      @current-change="onCurrentChange" />
    </footer>
    <MoveCopyCom :dialogContent="dialogContent" @save="save" @cancel="dialogContent.visible = false"/>
    <PatchDelete :patchDeleteContent="patchDeleteContent" @cancel="patchDeleteContent.visible = false" @changePrice="changePrice"/>
  </div>
</template>

<script>
import HeaderTipComp from 'com/common/header-tip'
import BaxInput from 'com/common/bax-input'
import BaxPagination from 'com/common/pagination'
import MoveCopyCom from './move-copy-com.vue'
import PatchDelete from './patch-delete.vue'

import { changeGroupKeywordsPrice, changeGroupKeywordsMatchType } from 'api/fengming'

import { fmtCpcRanking } from 'util/campaign'
import {
  RECOMMAND_SOURCES,
  SEM_PLATFORM_SHENMA,
  keywordStatus,
  KEYWORD_CHIBI_REJECT,
  KEYWORD_STATUS_ONLINE,
  MATCH_TYPE_OPTS,
  MATCH_TYPE_EXACT,
  MATCH_TYPE_PHRASE,
  getMatchTypeObj
} from 'constant/fengming'
import { keywordStatusTip, cpcTopPriceTip, matchTypeTip, keywordPriceTip } from 'constant/tip'
import { MIN_WORD_PRICE, MAX_WORD_PRICE } from 'constant/keyword'
import { toFloat } from 'util/kit'
import track from 'util/track'
import clone from 'clone'

const LIMIT = 10

export default {
  name: 'keyword-list',
  props: {
    originKeywords: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    keywords: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    platform: {
      type: Number,
      required: true
    },
    showPropRanking: {
      type: Boolean,
      default: true
    },
    showMatchType: {
      type: Boolean,
      default: false
    },
    groupOffline: {
      type: Boolean,
      default: false
    },
    groupOnline: {
      type: Boolean,
      default: true
    },
    groupId: {
      type: [String, Number],
      required: true
    },
    searchWord: {
      type: String,
      default: ''
    },
    negativeWords: {
      type: Array,
      default () {
        return []
      }
    },
    userInfo: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    }
  },
  computed: {
    isSearchCondition () {
      return !!this.searchWord
    },
    maxPriceLabel () {
      if (this.platform === SEM_PLATFORM_SHENMA) return '移动端出价(元/次点击)'
      return '电脑端最高出价(元/次点击)'
    },
    matchTypeLabel () {
      return `匹配方式(可设置<b style="color: #ff6350">${this.matchTypeRemainExactCount}</b>个精准匹配)`
    },
    rows () {
      const { currentPage } = this
      const start = currentPage * LIMIT
      if (this.isSearchCondition) {
        return this.searchKeywords.slice(start, start + LIMIT)
      }
      return this.keywords.slice(start, start + LIMIT)
    },
    currentPage () {
      return this.offset / LIMIT | 0
    },
    pagination () {
      return {
        limit: LIMIT,
        offset: this.offset,
        total: this.isSearchCondition ? this.searchKeywords.length : this.keywords.length
      }
    },
    wordLen () {
      console.log(this.keywords)
      return this.keywords.filter(o => !o.isDel).length
    },
    matchTypeRemainExactCount () {
      const maxCount = getMatchTypeObj(this.wordLen, this.userInfo.isSpecial).count(this.wordLen)
      const currentCount = this.keywords.filter(o => o.matchType === MATCH_TYPE_EXACT).length
      const count = maxCount - currentCount
      return count > 0 ? count : 0
    },
    searchKeywords () {
      if (this.isSearchCondition) {
        const searchWordArray = this.searchWord.trim().split(/[，,]]*/g)
        const exactList = []
        const noExactList = []
        this.keywords.forEach(k => {
          searchWordArray.includes(k.word) ? exactList.push(k) : noExactList.push(k)
        })
        const mohuList = noExactList.filter(k => searchWordArray.some(o => o && k.word.includes(o)))
        return [...exactList, ...mohuList]
      }
      return []
    },
    canOption () {
      return Object.keys(this.currentSelect).length
    }
  },
  data () {
    return {
      offset: 0,
      keywordPrice: '',
      matchType: MATCH_TYPE_PHRASE,

      pricePopoverVisible: false,
      matchTypePopVisible: false,
      loading: false,
      currentSelect: {},
      dialogContent: {
        visible: false,
        text: '',
        type: 'copy'
      },
      patchDeleteContent: {
        visible: false,
        type: 'delete'
      },
      isNewSelect: {},
      savePendding: false,

      // 常量
      keywordStatusTip,
      cpcTopPriceTip,
      keywordPriceTip,
      matchTypeTip,
      KEYWORD_CHIBI_REJECT,
      RECOMMAND_SOURCES,
      MATCH_TYPE_OPTS,
      MATCH_TYPE_EXACT,
      MATCH_TYPE_PHRASE
    }
  },
  methods: {
    fmtCpcRanking,
    change (selection) {
      // console.log(selection)
    },
    fmtStatus (row) {
      if (this.groupOffline) return '--'
      return keywordStatus[String(row.status)] || '--'
    },
    getRefuseReason (word) {
      const { refuseReason } = word.extra
      return (typeof refuseReason === 'string' ? refuseReason : refuseReason.message) || '审核驳回'
    },
    showAddPrice (row) {
      // tip 过去24小时排名低于5或无排名的，在线的 keyword，在线的 campaign
      const { cpcRanking, mobileCpcRanking, isPriceChanged, status: keywordStatus } = row
      // tip 电脑端和手机端任意一端排名大于5或者无排名
      let rankingLow = false
      if (this.platform === SEM_PLATFORM_SHENMA) {
        rankingLow = mobileCpcRanking > 5 || mobileCpcRanking <= 0
      } else {
        rankingLow = (cpcRanking > 5 || cpcRanking <= 0) || (mobileCpcRanking > 5 || mobileCpcRanking <= 0)
      }
      const show = keywordStatus === KEYWORD_STATUS_ONLINE && this.groupOnline && !isPriceChanged && rankingLow
      if (show) {
        track({
          action: 'pv: bump-price-by-20'
        })
      }
      return show
    },
    setCustomPrice (item, v) {
      const price = (v ? toFloat(v) : 0) * 100
      this.emitUpdateKeyword({ ...item, price })
    },
    bumpPriceBy20 (row) {
      track({
        action: 'click-button: bump-price-by-20'
      })
      this.setCustomPrice(row, this.$formatter.f2y(row.price * 1.2))
    },
    isValidPrice (row) {
      const finalPrice = row.price
      return finalPrice >= MIN_WORD_PRICE && finalPrice <= MAX_WORD_PRICE
    },
    resumeWord (row) {
      const { currentSelect, offset } = this
      if (this.negativeWords.some(o => o.word.toLowerCase() === row.word.toLowerCase())) {
        return this.$message.error('已存在否词列表，请先删除否词，在恢复')
      }
      if (currentSelect[offset].includes(row.id)) {
        this.currentSelect[offset] = currentSelect[offset].filter(o => o !== row.id)
      }
      this.emitUpdateKeyword({
        ...row,
        matchType: row.matchType === MATCH_TYPE_EXACT ? MATCH_TYPE_PHRASE : row.matchType,
        isDel: false,
        isRemove: false
      })
    },
    emitUpdateKeyword (itemWord, isRemove = false) {
      const idx = this.keywords.findIndex(o => o.word === itemWord.word)
      if (idx === -1) return
      if (isRemove) {
        return this.$emit('remove-keywords', idx)
      }

      const existWord = this.originKeywords.find(o => o.word.toLowerCase() === itemWord.word.toLowerCase())
      let newWord = clone(itemWord)
      // TIP 原有关键词列表有，并且价格和匹配模式有一个不一致，表示更新啦
      if (existWord) {
        const isEqual = (existWord.price === newWord.price) && (existWord.matchType === newWord.matchType)
        newWord = { ...clone(itemWord), isUpdated: !isEqual && !newWord.isDel }
      }
      const keywords = this.keywords
        .slice(0, idx)
        .concat([newWord], this.keywords.slice(idx + 1))

      this.$emit('update-keywords', keywords)
    },
    emitUpdateKeywords (changeTag = 'price', val) {
      const keywords = this.keywords.map(o => ({
        ...o,
        [changeTag]: val
      }))
      this.$emit('update-keywords', keywords)
    },
    async changeAllWordPrice () {
      const { query: { user_id: userId } } = this.$route
      const keywordPrice = this.keywordPrice.trim()
      if (!keywordPrice) return
      const price = keywordPrice * 100
      if (price < MIN_WORD_PRICE || price > MAX_WORD_PRICE) {
        return this.$message.error(`关键词有效出价区间为[${MIN_WORD_PRICE / 100}, ${MAX_WORD_PRICE / 100}]元，请调整出价`)
      }

      try {
        this.loading = true
        await changeGroupKeywordsPrice(this.groupId, { userId, price })
        this.emitUpdateKeywords('price', price)
        this.$emit('update-origin-keywords', 'price', price)
        this.$message.success('关键词批量改价成功')
      } finally {
        this.pricePopoverVisible = false
        this.loading = false
      }
    },
    async changeAllMatchType () {
      const matchType = this.matchType
      const { groupId } = this
      const { query: { user_id: userId } } = this.$route
      const params = {
        userId,
        matchType
      }
      try {
        this.loading = true
        await changeGroupKeywordsMatchType(groupId, params)
        this.emitUpdateKeywords('matchType', matchType)
        this.$emit('update-origin-keywords', 'matchType', matchType)
        this.$message.success('匹配方式批量修改成功')
      } finally {
        this.loading = false
        this.matchTypePopVisible = false
      }
    },
    onCurrentChange ({ offset }) {
      this.offset = offset
      const { currentSelect, rows } = this
      this.$nextTick(() => {
        rows.filter(a => this.transforArray(currentSelect).includes(a.id)).forEach(o => {
          this.$refs.multipleTable.toggleRowSelection(o, true)
        })
      })
    },
    deleteWord (row) {
      // TIP 删除时，更改状态
      const newRow = { ...row, isDel: true }
      const { currentSelect, offset } = this
      if (this.showMatchType && row.matchType !== MATCH_TYPE_PHRASE) {
        newRow.matchType = MATCH_TYPE_PHRASE
      }

      if (this.showMatchType) {
        // 删除之后的精准匹配的最大值和当前值
        const maxCount = getMatchTypeObj(this.wordLen - 1, this.userInfo.isSpecial).count(this.wordLen - 1)
        let currentCount = this.keywords.filter(o => o.matchType === MATCH_TYPE_EXACT).length
        if (String(row.matchType) === String(MATCH_TYPE_EXACT)) {
          currentCount--
        }
        if (maxCount < currentCount) {
          const h = this.$createElement
          const words = this.keywords.reduce((curr, prev) => {
            if (String(prev.matchType) === String(MATCH_TYPE_EXACT)) {
              return curr.concat(prev.word)
            }
            return curr
          }, [])
          this.$msgbox({
            title: '提示',
            message: h('div', null, [
              h('div', null, '操作失败，请先减少精确匹配方式的关键词后再重新操作。'),
              h('div', { style: 'marginTop: 10px' }, [
                h('span', null, '已设置精确匹配的关键词：'),
                h('span', { style: 'color: #ff4401' }, words.join('，'))
              ])
            ])
          })
          return
        }
      }
      if (!currentSelect[offset]) {
        currentSelect[offset] = []
        currentSelect[offset].push(row.id)
        this.currentSelect[offset] = currentSelect[offset]
      } else {
        this.currentSelect[offset].push(row.id)
      }
      this.emitUpdateKeyword(newRow, !!row.isNew)

      if (row.isNew) {
        let offset = this.offset - 1 > 0 ? this.offset : 0
        offset = offset === this.pagination.total - 1 ? offset - 1 : offset
        this.offset = offset
      }
    },
    selectAll (selection) {
      const selectionClone = clone(selection)
      this.currentSelect[this.offset] = selectionClone.map(o => o.id)
    },
    handleSelectionChange (selection, row) {
      this.currentSelect[this.offset] = selection.map(o => o.id)
    },
    transforArray (obj) {
      let result = []
      for (let i = 0; i < this.pagination.total; i++) {
        if (obj[i]) {
          result = [...result, ...obj[i]]
        }
      }
      return result
    },
    patchChangePrice () {
      const { currentSelect } = this
      if (!this.transforArray(currentSelect).length) {
        this.$message({
          type: 'error',
          message: '请至少选择一个关键词'
        })
        return
      }
      this.patchDeleteContent = {
        type: 'change',
        visible: true
      }
    },
    canDelete () {
      const { keywords, showMatchType, currentSelect } = this
      const newKeywords = clone(keywords)
      if (showMatchType) {
        // 删除之后的精准匹配的最大值和当前值
        const maxCount = getMatchTypeObj(this.wordLen - this.transforArray(currentSelect).length, this.userInfo.isSpecial).count(this.wordLen - this.transforArray(currentSelect).length)
        let currentCount = newKeywords.filter(o => o.matchType === MATCH_TYPE_EXACT).length
        newKeywords.forEach(row => {
          if (this.transforArray(currentSelect).includes(row.id)) {
            if (this.showMatchType && row.matchType !== MATCH_TYPE_PHRASE) {
              row.matchType = MATCH_TYPE_PHRASE
            }
          }
        })
        currentCount = currentCount - keywords.reduce((curr, item) => {
          if (this.transforArray(currentSelect).includes(item.id) && String(item.matchType) === String(MATCH_TYPE_EXACT)) { curr++ }
          return curr
        }, 0)
        if (currentCount > maxCount) {
          const h = this.$createElement
          const words = this.keywords.reduce((curr, prev) => {
            if (String(prev.matchType) === String(MATCH_TYPE_EXACT)) {
              return curr.concat(prev.word)
            }
            return curr
          }, [])
          this.$msgbox({
            title: '提示',
            message: h('div', null, [
              h('div', null, '操作失败，请先减少精确匹配方式的关键词后再重新操作。'),
              h('div', { style: 'marginTop: 10px' }, [
                h('span', null, '已设置精确匹配的关键词：'),
                h('span', { style: 'color: #ff4401' }, words.join('，'))
              ])
            ])
          })
          throw new Error()
        }
      }
      return newKeywords
    },
    async batchDelet () {
      const { currentSelect } = this
      if (!this.transforArray(currentSelect).length) {
        this.$message({
          type: 'error',
          message: '请至少选择一个关键词'
        })
        return
      }
      try {
        const newKeywords = this.canDelete()
        newKeywords.forEach(row => {
          if (this.transforArray(currentSelect).includes(row.id)) {
            row.isDel = true
            row.isUpdated = false
          }
        })
        const lastDeleteWords = newKeywords.filter(o => !this.transforArray(currentSelect).includes(o.id) || !o.isNew)
        this.$emit('update-keywords', lastDeleteWords)
      } catch (error) {
        console.log(error)
      }
    },
    batchRecover () {
      const { currentSelect, keywords } = this
      if (!this.transforArray(currentSelect).length) {
        this.$message({
          type: 'error',
          message: '请至少选择一个关键词'
        })
        return
      }
      const newKeywords = clone(keywords)
      newKeywords.forEach(row => {
        if (this.transforArray(currentSelect).includes(row.id)) {
          row.isDel = false
        }
      })
      this.$refs.multipleTable.clearSelection()
      this.currentSelect = {}
      this.$emit('update-keywords', newKeywords)
    },
    batchRemove () {
      const { currentSelect } = this
      if (!this.transforArray(currentSelect).length) {
        this.$message({
          type: 'error',
          message: '请至少选择一个关键词'
        })
        return
      }
      try {
        const newKeywords = this.canDelete()
        this.isNewSelect[this.offset] = newKeywords.filter(o => this.transforArray(currentSelect).includes(o.id)).map(o => ({
          isNew: true,
          isRemove: true,
          ...o
        }))
        this.dialogContent = {
          visible: true,
          text: '将对选中的关键词移动到目标单元中，并在当前单元会删除，请选择目标位置',
          type: 'move'
        }
      } catch (error) {
        console.log(error)
      }
    },
    batchCopy () {
      const { currentSelect, keywords } = this
      const keywordsCopy = clone(keywords)
      if (!this.transforArray(currentSelect).length) {
        this.$message({
          type: 'error',
          message: '请至少选择一个关键词'
        })
        return
      }
      this.isNewSelect[this.offset] = keywordsCopy.filter(o => this.transforArray(currentSelect).includes(o.id)).map(o => ({
        isNew: true,
        ...o
      }))
      this.dialogContent = {
        visible: true,
        text: '将对选中的关键词复制到目标单元中，请选择目标位置',
        type: 'copy'
      }
    },
    async save (form) {
      this.savePendding = true
      const { dialogContent, isNewSelect, keywords, currentSelect } = this
      const keywordsCopy = clone(keywords)
      const params = { ...form, moveKeywords: true }
      params.isNewSelect = this.transforArray(isNewSelect)
      const cboptions = {
        success: () => {
          if (dialogContent.type === 'move') {
            const newKeywords = keywordsCopy.filter(k => !this.transforArray(currentSelect).includes(k.id) || !k.isNew).map(o => this.transforArray(currentSelect).includes(o.id) ? { ...o, isRemove: true, isDel: true } : { ...o })
            this.$emit('update-keywords', newKeywords)
          }
        },
        error: () => {
          const newKeywords = keywordsCopy.map(o => this.transforArray(currentSelect).includes(o.id) ? { ...o, isRemove: false, isDel: false } : { ...o })
          this.$emit('update-keywords', newKeywords)
        },
        finally: () => {
          this.savePendding = false
          this.dialogContent.visible = false
          this.currentSelect = {}
          this.isNewSelect = {}
          this.$refs.multipleTable.clearSelection()
        }
      }
      await this.$emit('updateGroup', params, cboptions)
      this.savePendding = false
      this.dialogContent.visible = false
      this.currentSelect = {}
      this.isNewSelect = {}
      this.$refs.multipleTable.clearSelection()
    },
    resetSelect () {
      this.currentSelect = {}
      this.isNewSelect = {}
      this.$refs.multipleTable.clearSelection()
    },
    changePrice (price) {
      const { currentSelect, keywords } = this
      const newKeywords = clone(keywords)
      newKeywords.forEach(row => {
        if (this.transforArray(currentSelect).includes(row.id)) {
          row.isUpdated = true
          row.price = price * 100
        }
      })
      this.patchDeleteContent.visible = false
      this.$emit('update-keywords', newKeywords)
      this.currentSelect = []
    }
  },
  watch: {
    searchWord () {
      this.offset = 0
    },
    keywords: {
      deep: true,
      immediate: true,
      handler (newV, oldV) {
        const { currentSelect } = this
        this.$nextTick(() => {
          newV.filter(a => this.transforArray(currentSelect).includes(a.id)).forEach(o => {
            console.log(o)
            this.$refs.multipleTable.toggleRowSelection(o, true)
          })
        })
      }
    }
  },
  components: {
    HeaderTipComp,
    BaxInput,
    BaxPagination,
    MoveCopyCom,
    PatchDelete
  }
}
</script>

<style lang="scss" scoped>
.keyword-list {
  margin-top: 20px;
  max-width: 1150px;
  .new-word {
    color: $c-main;
    font-size: 12px;
  }
  .del-word {
    color: $c-success;
    font-size: 12px;
  }
  .updated-word {
    color: $c-info;
    font-size: 12px;
  }
  .good-word {
    color: $c-main;
    font-size: 12px;
  }
  .price-action {
    font-size: 13px;
    font-weight: 300;
    color: $c-main;
  }
  .price,
  .match-type {
    display: flex;
    align-items: center;
    > .match-type-select {
      /deep/ .el-input {
        width: 120px;
      }
    }
    > label {
      margin-left: 10px;
      font-size: 12px;
      color: $c-main;
      max-width: 180px;
    }
  }
}

.actions {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  & .el-button {
    margin-left: 6px;
  }
}
.match-radio {
  display: block;
  margin-bottom: 10px;
}
.opration-item{
  margin-top: 20px;
}
</style>
