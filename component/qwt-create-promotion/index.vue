<template>
  <div class="qwt-create-promotion">
    <main>
      <section class="promotion-target">
        <header>
          推广目标设置
          <p>
            按点击付费，展现免费，100元一键投放百度，神马等多渠道
            <el-popover trigger="hover">
              <img :src="PRE_IMG_PROMOTION" width="638" height="405">
              <a slot="reference">查看详情</a>
            </el-popover>
          </p>
        </header>

        <div>
          <label>投放页面：</label>
          <div class="landingpage">
            <fm-tip class="landingpage-tip" img-url="//file.baixing.net/201903/8d224eb6179a947eecbf0fde089f7ed3.png">电话接不停小妙招</fm-tip>
            <div style="margin-bottom: 10px">
              <el-radio-group v-model="newPromotion.landingType" @change="clearLandingInput" size="small">
                <el-radio-button v-for="option of landingTypeOpts" :key="option.value" :label="option.value">{{option.label}}</el-radio-button>
              </el-radio-group>
            </div>
            <div>
              <user-ad-selector
                ref="userAdSelector"
                :type="adSelectorType"
                v-if="newPromotion.landingType === LANDING_TYPE_AD"
                :all-areas="allAreas" :limit-mvp="false"
                :selected-id="newPromotion.landingPageId"
                @select-ad="onSelectAd"
              />
              <mvip-selector
                v-if="newPromotion.landingType === LANDING_TYPE_STORE"
                :initValue="newPromotion.landingPageId"
                @change="(...args) => setLandingAndID(LANDING_TYPE_STORE, ...args)"
              />
              <p class="authing-tip" v-if="newPromotion.landingType === LANDING_TYPE_STORE">提示： 为提升客户留资效果凤鸣仅支持店铺作为落地页 </p>
            </div>
          </div>
        </div>
        <div>
          <label>投放城市：</label>
          <div>
            <el-tag type="danger" closable class="kw-tag"
              v-for="c in newPromotion.areas" :key="c"
              @close="removeArea(c)">
              {{ formatterArea(c) }}
            </el-tag>
            <i class="el-icon-plus" @click="areaDialogVisible = true"></i>
          </div>
        </div>
        <div>
          <label>投放行业：</label>
          <div class="industry">
             <el-cascader
              ref="refHandle"
              :options="industryOptions"
              v-model="cascaderValue"
              :props="{ checkStrictly: true, expandTrigger: 'hover' }"
              @change="industryChange"
              @expand-change="expandChange"
              popper-class="industry-class"
              clearable></el-cascader>
          </div>
          <span class="industryTip"
          @click="upVisbleClick"
          >
            <u>没有找到你的行业</u>
          </span>
        </div>
        <promotion-area-limit-tip :all-areas="allAreas" :selected-areas="newPromotion.areas" />
      </section>

      <section class="creative">
        <fm-tip class="creative-tip" position="creative" img-url="//file.baixing.net/201903/d6f4502a0e8a659b78a33fbb3713e6b9.png">创意怎么才能飘红</fm-tip>
        <header class="top-col">
          <promotion-creative-tip />
          <el-button v-if="newPromotion.landingType === LANDING_TYPE_GW" class="button" type="primary"
                     size="small" @click="getRecommendKeywords">一键拓词</el-button>
        </header>
        <creative-editor
          :platforms="newPromotion.sources"
          :title="newPromotion.creativeTitle"
          :content="newPromotion.creativeContent"
          @change="handleCreativeValueChange"
          @error="handleCreativeError"
        />
      </section>

      <section class="keyword">
        <header>选取推广关键词</header>
        <p class="tip">请选取<span v-if="userInfo.isSpecial === 0">20</span> <span v-else>1</span>个以上关键词，关键词越多您的创意被展现的机会越多。根据当月数据，为您推荐如下关键词</p>
        <el-button type="primary" style="margin-top:10px" size="small"
                   @click="addkeys">批量添加关键词</el-button>
        <el-button
          type="primary"
          style="margin-top:10px"
          size="small"
          @click="showBaiduExpandWordDialog">
          规划师拓词工具
        </el-button>
        <baidu-expand-words-dialog
          v-if="baiduExpandWordsDialogVisible"
          :visible.sync="baiduExpandWordsDialogVisible"
          :extra-query="{
            areas: newPromotion.areas
          }"
          @confirm="addBaiduWords"
        />
        <div class="kw-tag-container">
          <el-tag class="kw-tag"
                  :class="{'kw-tag-fh': RECOMMAND_SOURCES.includes(kw.recommandSource)}"
                  v-for="(kw, index) in newPromotion.keywords"
                  :key="index"
                  closable
                  type="warning"
                  @close="removeKeyword(index)">
                  {{kw.word}}
                  {{RECOMMAND_SOURCES.includes(kw.recommandSource) ? '(好词)': ''}}
          </el-tag>
          <el-autocomplete
            v-model="queryWord"
            :debounce="600"
            :fetch-suggestions="fetchRecommends"
            placeholder="添加自定义词"
            @select="selectRecommend"
            :trigger-on-focus="false"
            size="small"
          />
        </div>
      </section>

      <section class="price">
        <header>设置预算</header>
        <div class="kw-price">
          <label>关键词出价<cpc-price-tip />：</label>
          <bax-input :value="f2y(kwPrice) || f2y(recommendKwPrice)"
                     @blur="onKwPriceChange"
                     @keyup="onKwPriceChange"
                     class="input"
                     size="small" />元
          <span class="tip">（关键词出价区间为 [2, 999] 元）</span>
        </div>

        <div class="platform">
          <label>选择渠道
            <el-tooltip
              style="cursor:pointer;"
              content="您可以根据需求选择一个或多个渠道展示您的广告。不同渠道会分开建立投放计划，您可以在管理推广计划页面对您的计划进行管理。"
              placement="right">
              <i class="el-icon-question"></i>
            </el-tooltip>：
          </label>
          <el-checkbox-group v-model="newPromotion.sources" size="small" class="platform-checkbox">
            <el-checkbox v-for="(opt, index) in semPlatformOpts" :key="index" :label="opt.value">{{opt.label}}</el-checkbox>
          </el-checkbox-group>
          <p v-if="isShenmaChecked" class="tip warning">神马渠道仅支持移动端, 禁止投放搬家、金融类（包括但不限于担保贷款）信息</p>
        </div>

        <div class="budget">
          <label>单渠道日预算：</label>
          <bax-input :value="f2y(newPromotion.dailyBudget)"
                     @blur="onBudgetChange"
                     @keyup="onBudgetChange"
                     class="input"
                     size="small" />元
          <p class="tip">（根据您选取的关键词，建议最低预算为<strong class="red">{{ f2y(predictedInfo.minDailyBudget) }} </strong>元）</p>
        </div>
        <p class="tip">
          扣除其余有效计划日预算后，您的推广资金可用余额为￥{{f2y(currentBalance)}}元，可消耗<strong class="red strong">{{predictedInfo.days}}</strong>天
        </p>
        <contract-ack type="content-rule" ref="contract"/>
        <div>
          <el-button type="primary"
            :disabled="isCreating"
            @click="createPromotion">
            创建推广
          </el-button>
        </div>
        <promotion-charge-tip></promotion-charge-tip>
      </section>
    </main>

    <area-selector type="qwt" :all-areas="allAreas"
      :areas="newPromotion.areas"
      :visible="areaDialogVisible"
      :enable-china="false"
      @ok="onChangeAreas"
      @cancel="areaDialogVisible = false"
    />

    <charge-dialog
      :userInfo="userInfo"
      :visible="chargeDialogVisible"
      @cancel="gotoPromotionList"
    />
    <qwt-add-keywords-dialog
      ref="qwtAddKeywordsDialog"
      title="批量添加关键词"
      @close="addKeywordsDialog = false"
      @update-keywords="updatePromotionKeywords"
      :visible="addKeywordsDialog"
      :original-keywords="newPromotion.keywords"
      :areas="newPromotion.areas"
      :sources="newPromotion.sources"
    />
    <bw-industry-selector
      @close="IndustryDialogVisible = false"
      @submit="industrySubmit"
      :visible="IndustryDialogVisible"
    />
    <el-dialog
      title="尊敬的用户："
      :visible.sync="dialogVisible"
      width="30%"
      center
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="handleClose"
      >
      <span>&nbsp;&nbsp;根据最新的风控策略要求，需求认证身份才能新建计划，系统检测到您未认证相关资质，请跳转完成认证。</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="clickLocation">跳转认证</el-button>
      </span>
</el-dialog>

  </div>
</template>

<script>
import Vue from 'vue'
import { Message } from 'element-ui'
import uuid from 'uuid/v4'
import clone from 'clone'
import BaiduExpandWordsDialog from 'com/common/qwt-baidu-expand-words'
import PromotionCreativeTip from 'com/widget//promotion-creative-tip'
import PromotionAreaLimitTip from 'com/widget/promotion-area-limit-tip'
import PromotionChargeTip from 'com/widget/promotion-charge-tip'
import UserAdSelector from 'com/common/user-ad-selector'
import CreativeEditor from 'com/widget/creative-editor'
import MvipSelector from 'com/common/mvip-selector'
import AreaSelector from 'com/common/area-selector'
import ChargeDialog from 'com/common/charge-dialog'
import CpcPriceTip from 'com/widget/cpc-price-tip'
import ContractAck from 'com/widget/contract-ack'
import wxBindModal from 'com/common/wx-bind-modal'
import FmTip from 'com/widget/fm-tip'
import qwtAddKeywordsDialog from 'com/common/qwt-add-keywords-dialog'
import BaxInput from 'com/common/bax-input'
import BwIndustrySelector from 'com/common/bw-industry-selector'
import qs from 'query-string'
import track, { trackRecommendService } from 'util/track'
import { TimeTracker, TimeInput, wordTime } from 'util/time'
import {
  f2y,
  toFloat,
  isQwtEnableCity,
  fmtAreasInQwt,
  getCnName,
  getCampaignPrediction
} from 'util'

import {
  createCampaign,
  queryAds,
  getIndusty,
  postIndusty,
  checkIdentity
} from 'api/fengming'

import {
  SEM_PLATFORM_SHENMA,
  landingTypeOpts,
  semPlatformOpts,
  LANDING_TYPE_AD,
  LANDING_TYPE_GW,
  LANDING_TYPE_258,
  LANDING_TYPE_STORE,
  RECOMMAND_SOURCE_FH,
  NEW_RECOMMAND_SOURCE_FH
} from 'constant/fengming'

import store from './store'

const MVP_AD = 0

const RECOMMAND_SOURCES = [RECOMMAND_SOURCE_FH, NEW_RECOMMAND_SOURCE_FH]

const MIN_DAILY_BUDGET = 100 * 100

const promotionTemplate = {
  landingType: LANDING_TYPE_STORE,
  landingPage: '',
  landingPageId: '',
  areas: [],

  creativeTitle: '',
  creativeContent: '',

  keywords: [],
  sources: semPlatformOpts.map(opt => opt.value),
  dailyBudget: MIN_DAILY_BUDGET,
  firstId: 0,
  secondId: 0,
  thirdId: 0
}
export default {
  name: 'qwt-create-promotion',
  components: {
    BaiduExpandWordsDialog,
    PromotionCreativeTip,
    PromotionAreaLimitTip,
    MvipSelector,
    PromotionChargeTip,
    UserAdSelector,
    CreativeEditor,
    AreaSelector,
    ChargeDialog,
    ContractAck,
    CpcPriceTip,
    FmTip,
    qwtAddKeywordsDialog,
    BaxInput,
    BwIndustrySelector
  },
  fromMobx: {
    searchRecommends: () => store.searchRecommends,
    urlRecommends: () => store.urlRecommends,

    currentBalance: () => store.currentBalance,
    campaignsCount: () => store.campaignsCount
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    },
    salesInfo: {
      type: Object,
      required: true,
      default: () => {}
    },
    allAreas: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      newPromotion: clone(promotionTemplate),
      actionTrackId: uuid(),
      queryWord: '',
      creativeError: null,
      kwPrice: 0,
      LANDING_TYPE_AD,
      LANDING_TYPE_GW,
      LANDING_TYPE_258,
      LANDING_TYPE_STORE,
      RECOMMAND_SOURCES,

      searchRecommendsVisible: false,
      chargeDialogVisible: false,
      areaDialogVisible: false,
      baiduExpandWordsDialogVisible: false,
      IndustryDialogVisible: false,
      dialogVisible: false,
      semPlatformOpts,
      isCreating: false,
      showPromotion: false,
      timeout: null,
      // 关键词时间
      keyTime: 0,
      // 输入的时间
      inputTime: 0,
      // PRE_IMG_PROMOTION: assetHost + 'promotion-advantage.png'
      PRE_IMG_PROMOTION: '//file.baixing.net/201809/a995bf0f1707a3e98a2c82a5dc5f8ad3.png',
      addKeywordsDialog: false,

      landingTypeOpts: landingTypeOpts.filter(o => o.value !== LANDING_TYPE_GW),

      industryOptions: [],
      cascaderValue: [],
      isIdenity: false
    }
  },
  computed: {
    isShenmaChecked () {
      return this.newPromotion.sources.includes(SEM_PLATFORM_SHENMA)
    },

    adSelectorType () {
      return this.$route.query.adId ? 'reselect' : ''
    },
    predictedInfo () {
      const dailyBudget = this.newPromotion.dailyBudget

      if (!dailyBudget) {
        return {
          minDailyBudget: MIN_DAILY_BUDGET,
          days: 0
        }
      }
      const { currentBalance, newPromotion } = this

      let prices = []
      if (this.kwPrice) {
        prices = newPromotion.keywords.map(kw => this.kwPrice)
      } else {
        prices = newPromotion.keywords.map(kw => this.recommendKwPrice)
      }

      const tempPredictedInfo = getCampaignPrediction(currentBalance, dailyBudget, prices)
      const sourcesLen = Math.max(1, this.newPromotion.sources.length)
      return {
        ...tempPredictedInfo,
        days: (tempPredictedInfo.days / sourcesLen) | 0
      }
    },

    recommendKwPrice () {
      // 复制推荐词价格取平均值
      if (this.$route.query.cloneId) {
        const keywords = this.newPromotion.keywords
        const sum = this.newPromotion.keywords.reduce((total, kw) => total + kw.price, 0)
        return Math.min(Math.max(200, toFloat(sum / keywords.length)), 99900)
      }
      const max = Math.max.apply(null, this.newPromotion.keywords.map(kw => kw.price))
      return Math.min(Math.max(200, toFloat(max, 0)), 99900)
    }
  },
  methods: {
    handleClose () {
      this.dialogVisible = false
    },
    clickLocation () {
      window.location.href = 'https://www.baixing.com/bind/'
    },
    async checkIdentity () {
      const { user_id: userId } = qs.parse(location.search)
      const res = await checkIdentity({
        userId
      })
      this.dialogVisible = !res.data
      this.isIdenity = !res.data
    },
    addkeys () {
      this.addKeywordsDialog = true
      wordTime()
    },
    f2y,
    isSameKeyword (a, b) {
      const compareKeys = ['word']
      return compareKeys.every(k => a[k] === b[k])
    },
    addKeywords (words = []) {
      words = words instanceof Array ? [...words] : [words]
      const { keywords } = this.newPromotion
      while (words.length) {
        const newWord = words.pop()
        if (!keywords.find(x => this.isSameKeyword(x, newWord))) {
          this.newPromotion.keywords.push(newWord)
        }
      }
    },
    showBaiduExpandWordDialog () {
      if (!this.newPromotion.areas.length) {
        this.$message.error('请先选择投放城市')
        return false
      }
      this.baiduExpandWordsDialogVisible = true
      TimeInput()
    },
    addBaiduWords (words) {
      const bridge = x => ({
        word: x.keyword,
        price: x.price
      })
      this.addKeywords(words.map(x => bridge(x)))
      this.keyTime = wordTime('keyword')
    },
    updatePromotionKeywords (kwAddResult) {
      this.addKeywordsDialog = false
      if (!kwAddResult) return
      const { normalList } = kwAddResult
      this.addKeywords(normalList)
      // 关键词输入的时间
      this.keyTime = wordTime('keyword')
      const { actionTrackId, userInfo } = this
      track({
        roles: userInfo.roles.map(r => r.name).join(','),
        action: 'click-button: add-keyword-list',
        baixingId: userInfo.baixingId,
        time: Date.now() / 1000 | 0,
        baxId: userInfo.id,
        actionTrackId,
        keywordsLen: normalList.length,
        keywords: normalList.map(item => item.word).join(',')
      })
    },
    handleCreativeValueChange ({ title, content }) {
      this.newPromotion.creativeTitle = title
      this.newPromotion.creativeContent = content
      this.inputTime = TimeInput('blur')
    },
    handleCreativeError (message) {
      if (message) Message.error(message)
      this.creativeError = message
    },
    fetchRecommends (query, cb) {
      query = query.trim()
      if (query) {
        const { areas, sources } = this.newPromotion
        store.recommendByWord(query, { areas, sources }).then(
          () => {
            cb(this.searchRecommends)
          }
        )
      }
    },
    selectRecommend (item) {
      const { keywords } = this.newPromotion
      if (keywords.find(kw => kw.word === item.word)) {
        Message.warning('该关键词已存在')
      } else {
        keywords.push(item)
        this.queryWord = ''
      }
    },

    removeKeyword (index) {
      this.newPromotion.keywords.splice(index, 1)
    },

    onKwPriceChange (val) {
      this.kwPrice = toFloat(val) * 100
    },

    onBudgetChange (val) {
      this.newPromotion.dailyBudget = toFloat(val) * 100
    },

    setLanding (type, url) {
      this.newPromotion.landingType = type
      this.newPromotion.landingPage = url
    },

    setLandingAndID (type, url, id) {
      this.setLanding(type, url)
      this.newPromotion.landingPageId = id
    },

    clearLandingInput () {
      this.newPromotion.landingPage = ''
      this.newPromotion.landingPageId = ''
    },

    async onSelectAd (ad) {
      // 【凤鸣】落地页选择搬家、金融类帖子的计划渠道默认不选中神马
      const categories = ['banjia', 'jinrongfuwu', 'licaifuwu', 'kuaijijianzhi']
      if (categories.includes(ad.category) && this.newPromotion.sources.includes(SEM_PLATFORM_SHENMA)) {
        const index = this.newPromotion.sources.indexOf(SEM_PLATFORM_SHENMA)
        this.newPromotion.sources.splice(index, 1)
      }

      const { allAreas } = this

      if (isQwtEnableCity(ad.city, allAreas)) {
        this.newPromotion.areas = [ad.city]
      }

      this.newPromotion.landingType = LANDING_TYPE_AD
      this.newPromotion.landingPageId = ad.adId
      this.newPromotion.landingPage = ad.url

      await this.recommendByUrl()

      this.newPromotion.creativeTitle = ad.title && ad.title.slice(0, 24)
      this.newPromotion.creativeContent = ad.content && ad.content.slice(0, 39)
    },

    trackPromotionKeywords (promotionIds, promotion) {
      // 凤凰于飞推荐词列表
      const recommendKeywords = this.urlRecommends
        .filter(({ recommandSource }) => RECOMMAND_SOURCES.includes(recommandSource))
        .map(({ word, recommandSource }) => `${word}_${recommandSource}`)
        .join(',')

      const selectedKeywords = promotion.keywords
        .map(({ word, recommandSource = 'user_selected' }) => `${word}=${recommandSource}`)
        .join(',')

      const dailyBudget = promotion.dailyBudget / 100

      trackRecommendService({
        action: 'record-keywords',

        ids: promotionIds.join(','),
        areas: promotion.areas.join(','),
        landingPage: promotion.landingPage,
        landingType: promotion.landingType,
        creativeTitle: promotion.creativeTitle,
        creativeContent: promotion.creativeContent,
        sources: promotion.sources.join(','),
        selectedKeywords,
        recommendKeywords,
        dailyBudget,
        keywordPrice: f2y(this.kwPrice) || f2y(this.recommendKwPrice)
      })
    },

    async createPromotion () {
      if (this.isIdenity) {
        this.dialogVisible = true
        return
      }
      if (!this.$refs.contract.$data.isAgreement) {
        // console.log('这是创建总时间' + TimeTracker(2))
        return this.$message.error('请阅读并勾选同意服务协议，再进行下一步操作')
      }
      if (this.isCreating) {
        return Message.warning('正在创建中, 请稍等一小会 ~')
      }

      this.isCreating = true

      const { actionTrackId, userInfo } = this
      const promotion = clone(this.newPromotion)

      track({
        roles: userInfo.roles.map(r => r.name).join(','),
        action: 'click-button: create-campaign',
        baixingId: userInfo.baixingId,
        time: Date.now() / 1000 | 0,
        baxId: userInfo.id,
        actionTrackId
      })
      // 记录操作的时间
      track({
        action: 'click-button: create-time',
        baixingId: userInfo.baixingId,
        time: Date.now() / 1000 | 0,
        baxId: userInfo.id,
        createPromoteTime: TimeTracker(2),
        createContent: this.inputTime,
        inputkeywords: this.keyTime
      })
      try {
        await this._createPromotion(promotion)
      } finally {
        this.isCreating = false
      }
    },

    async _createPromotion (p) {
      const { currentBalance, allAreas } = this

      if (!p.sources.length) return Message.error('请选择投放渠道')

      if (p.dailyBudget < MIN_DAILY_BUDGET) {
        return Message.error(`推广日预算需大于 ${f2y(MIN_DAILY_BUDGET)} 元`)
      }
      if (p.dailyBudget > 10000000 * 100) {
        return Message.error('推广日预算太高啦！您咋这么土豪呢~')
      }

      if (!p.landingPage) {
        return Message.error('请填写投放页面')
      }

      if (this.creativeError) {
        return Message.error(this.creativeError)
      }

      if (!p.creativeTitle || !p.creativeContent) {
        return Message.error('请填写创意')
      }

      if (!p.keywords.length && this.userInfo.isSpecial === 0) {
        return Message.error('请填写关键字')
      }

      if (!this.cascaderValue.length) {
        return Message.error('请选择投放行业')
      }

      if (p.keywords.length < 20 && this.userInfo.isSpecial === 0) {
        return Message.error('请至少添加20个投放关键词')
      } else if (p.keywords.length < 1 && this.userInfo.isSpecial === 1) {
        return Message.error('请至少添加1个投放关键词')
      }

      // 这个应该是个雷！
      // for (const w of p.keywords) {
      //   if (w.price < MIN_WORD_PRICE || w.price > MAX_WORD_PRICE) {
      //     return Message.error(keywordPriceTip)
      //   }
      // }

      if (!p.areas.length) {
        return Message.error('请选择投放区域')
      }

      const disabledArea = p.areas.find(area => !isQwtEnableCity(area, allAreas))
      if (disabledArea) {
        return Message.error(`计划包含无法投放的区域：${disabledArea.nameCn}`)
      }

      if (this.kwPrice) {
        if (this.kwPrice < 200 || this.kwPrice > 99900) {
          return Message.error('关键词价格需在[2, 999]区间内')
        } else {
          p.keywords.forEach(kw => {
            kw.price = this.kwPrice
          })
        }
      } else {
        p.keywords.forEach(kw => {
          kw.price = this.recommendKwPrice
        })
      }

      if (!p.landingPageId) {
        delete p.landingPageId
      }
      const { query: { user_id: userId } } = this.$route
      const promotionIds = await createCampaign({ ...fmtAreasInQwt(p, allAreas), userId })
      // 凤凰于飞打点
      this.trackPromotionKeywords(promotionIds, p)

      Message.success('创建成功')

      store.clearStore()

      // 微信绑定弹窗
      if (!this.userInfo.hasBoundWechat) {
        await this.openWxModal()
      }

      if (p.dailyBudget > currentBalance) {
        this.chargeDialogVisible = true
      } else {
        setTimeout(() => {
          this.gotoPromotionList()
        }, 1000)
      }
    },
    // 如果落地页类型为帖子（或 258 官网），则会在选择城市后自动推荐关键词
    async checkRecommendByURL () {
      if ([
        LANDING_TYPE_AD,
        LANDING_TYPE_258
      ].includes(this.newPromotion.landingType)) {
        await this.recommendByUrl()
      }
    },
    async recommendByUrl (opts = {}) {
      let { landingType, landingPage, areas } = this.newPromotion
      landingPage = opts.landingPage || landingPage
      const reqBody = {
        ...opts,
        url: landingPage,
        landingType: opts.landingType || landingType,
        areas: opts.areas || areas
      }

      if (landingPage) {
        await store.recommendByUrl(reqBody)
        this.newPromotion.keywords = clone(this.urlRecommends)
      }
    },
    gotoPromotionList () {
      this.chargeDialogVisible = false

      this.$router.push({
        name: 'qwt-promotion-list'
      })
    },

    onLandingTypeChange (typeId) {
      const { landingType } = this.newPromotion
      if (landingType === typeId) {
        return
      }

      this.newPromotion.landingType = typeId

      if ([1, 4].includes(typeId)) {
        this.newPromotion.landingPage = ''
      }
    },

    async onChangeAreas (areas) {
      this.newPromotion.areas = [...areas]
      this.areaDialogVisible = false
      await this.checkRecommendByURL()
    },

    formatterArea (name) {
      const { allAreas } = this
      return getCnName(name, allAreas)
    },

    async removeArea (c) {
      this.newPromotion.areas = [
        ...this.newPromotion.areas.filter(i => i !== c)
      ]
      await this.checkRecommendByURL()
    },
    handleWxModalClose () {
      this.isWxModalVisible = false
    },
    openWxModal () {
      const ModalConstructor = Vue.extend(wxBindModal)
      this.modalInstance = new ModalConstructor({
        el: document.createElement('div')
      })
      document.body.appendChild(this.modalInstance.$el)
      this.modalInstance.visible = true
      return new Promise(resolve => {
        this.modalInstance.closeCb = () => {
          resolve('关闭')
        }
      })
    },

    async cloneCampaignById (campaignId) {
      const { query: { user_id: userId } } = this.$route
      const originPromotion = await store.getCampaignInfo(campaignId, { userId })
      const clonedPromotion = {}
      let ad = null
      // 判断源计划落地页类型是主站广告或者官网
      if (originPromotion.landingType === MVP_AD) {
        // 官网
        const result = await queryAds({
          limitMvp: false,
          adId: originPromotion.landingPageId,
          limit: 1,
          userId
        })
        ad = result.ads && result.ads[0]
        if (ad && String(ad.adId) === String(originPromotion.landingPageId)) {
          clonedPromotion.landingPage = ad.url
          await this.$refs.userAdSelector.reset('selected', ad.adId)
        }
      }
      Object.keys(promotionTemplate).forEach(key => {
        if (ad && key === 'landingPage') return
        clonedPromotion[key] = originPromotion[key]
      })
      clonedPromotion.landingPageId = originPromotion.landingPageId.toString()
      clonedPromotion.creativeTitle = originPromotion.creative.title
      clonedPromotion.creativeContent = originPromotion.creative.content
      clonedPromotion.sources = []
      this.newPromotion = clonedPromotion
    },
    async getRecommendKeywords () {
      const { creativeTitle, creativeContent, areas, landingPage, landingType } = this.newPromotion
      if (creativeTitle === '' || creativeContent === '') {
        return this.$message.error('请填写创意')
      }
      if (!landingPage) {
        return this.$message.error('请选择官网落地页')
      }
      if (!areas.length) {
        return this.$message.error('请选择投放城市')
      }

      const { userInfo, actionTrackId } = this
      track({
        action: 'click-button: create-campaign-recommend-vad',
        baixingId: userInfo.baixingId,
        time: Date.now() / 1000 | 0,
        baxId: userInfo.id,
        actionTrackId,
        landingPage,
        landingType,
        creativeTitle,
        creativeContent,
        areas
      })
      await this.recommendByUrl({
        landingType: LANDING_TYPE_GW,
        creativeTitle,
        creativeContent
      })
    },
    // 行业输入
    async industrySubmit (el) {
      // 在此处更改
      const x = el.trim()
      if (x.length >= 2) {
        const { meta } = await postIndusty({ category: el })
        if (meta.message === 'Success') {
          Message.success('添加成功')
        } else {
          Message.error('添加失败')
        }
      } else {
        Message.error('最少两个字符')
        return
      }
      this.IndustryDialogVisible = false
    },
    industryChange () {
      const x = this.cascaderValue
      x.length && x.forEach((item, index) => {
        switch (index) {
          case 0:
            this.newPromotion.firstId = item
            break
          case 1:
            this.newPromotion.secondId = item
            break
          case 2:
            this.newPromotion.thirdId = item
            break
          default:
            break
        }
      })
    },
    async getAllInStrusty () {
      const { data } = await getIndusty()
      this.industryOptions = data.map(item => ({ ...item, disabled: true }))
    },
    expandChange () {
      const that = this
      setTimeout(() => {
        document.querySelectorAll('.el-cascader-node__label').forEach(el => {
          el.onclick = function () {
            this.previousElementSibling.click()
            that.$refs.refHandle.dropDownVisible = false // 监听值发生变化就关闭它
          }
        })
        document.querySelectorAll('.el-cascader-node .el-radio').forEach(el => {
          el.onclick = function () {
            that.$refs.refHandle.dropDownVisible = false // 监听值发生变化就关闭它
          }
        })
      }, 100)
    },
    upVisbleClick () {
      if (this.cascaderValue.length < 2) {
        this.$message({
          message: '请先选择一二行业'
        })
        return
      }
      this.IndustryDialogVisible = true
    }
  },

  async mounted () {
    const { userId } = this.salesInfo
    await Promise.all([
      store.getCurrentBalance({ userId }),
      store.getCampaignsCount({ userId })
    ])

    setTimeout(() => {
      // pv
      const { actionTrackId, userInfo } = this

      track({
        roles: userInfo.roles.map(r => r.name).join(','),
        action: 'enter-page: create-campaign',
        baixingId: userInfo.baixingId,
        baxId: userInfo.id,
        actionTrackId
      })
    }, 800)

    let clickSent = false

    document.addEventListener('click', evt => {
      if (!clickSent) {
        const { actionTrackId, userInfo } = this
        track({
          roles: userInfo.roles.map(r => r.name).join(','),
          action: 'clicked: create-campaign',
          baixingId: userInfo.baixingId,
          baxId: userInfo.id,
          actionTrackId
        })
        clickSent = true
      }
    })

    // 从投放列表复制按钮点进来的，除了渠道不选择外其他都带出来
    const cloneId = this.$route.query.cloneId
    if (cloneId) {
      await this.cloneCampaignById(cloneId)
      return
    }
    // 主站个人中心跳转 case
    const { adId } = this.$route.query
    if (adId) {
      const result = await queryAds({
        limitMvp: false,
        adId: adId,
        limit: 1,
        userId
      })
      const ad = result.ads && result.ads[0]
      if (ad && ad.adId === String(adId)) {
        await this.onSelectAd(ad)
      }
    }
    // 触发时间
    TimeTracker(1)
    this.getAllInStrusty()
  },
  // created () {
  //   this.checkIdentity()
  // },
  beforeDestroy () {
    store.clearStore()
  },

  destroyed () {
    clearTimeout(this.timeout)
  },
  watch: {
    'newPromotion.landingType' (newVal, oldVal) {
      this.newPromotion.landingPage = ''
      this.newPromotion.landingPageId = ''
    },
    'queryWord' (newV) {
      this.keyTime = wordTime('keyword')
    }
    // 'keyTime' (newV) {
    //   console.log('这是添加关键词的时间' + newV)
    // },
    // 'inputTime' (newV) {
    //   console.log('这是输入的总时间' + newV)
    // }
  }
}
</script>

<style scoped lang="scss">
.authing-tip {
    align-items: center;
    font-size: 12px;
    color: $c-main;
}
.input {
  width: 150px;
}

strong.red {
  color: red;
  margin: 0 5px;
  &.strong {
    font-size: 16px;
  }
}

.landingpage {
  position: relative;
  min-width: 540px;
  & > .landingpage-tip {
    position: absolute;
    right: 0;
    top: 20px;
  }
}

.creative {
  position: relative;
  & > .creative-tip {
    position: absolute;
    bottom: 38px;
    left: 660px;
  }
  & .top-col {
    display: flex;
    align-items: center;
    & .button {
      margin-left: 32px;
      padding: 8px 25px;
    }
  }
}

.qwt-create-promotion {
  font-size: 14px;
  color: #6a778c;
  width: 100%;

  & > main {
    & > section {
      border-radius: 4px;
      margin-bottom: 10px;
      background-color: #fff;
      padding: 20px;
      box-shadow: 0 2px 9px 0 rgba(83, 95, 127, 0.1);
      &:last-child {
        padding-bottom: 40px;
      }

      & > header {
        color: #6a778c;
        font-weight: bold;
      }

      & > div {
        display: flex;
        align-items: baseline;
        margin: 12px 0;
      }
    }
  }
}
.kw-tag {
  margin-right: 5px;
  margin-top: 8px;
}
.kw-tag-fh {
  color: #16b7ff;
  background: #ecf5ff;
  border-color: #b3d8ff;
}
.kw-tag-container {
  max-width: 100%;
  display: flex;
  flex-wrap: wrap;
  & /deep/ .el-input__inner {
    margin-top: 8px;
  }
}
.el-icon-question {
  color: #6a778c;
  margin-left: 10px;
}
.tip {
  font-size: 12px;
}
.tip.warning {
  color: red;
}
.platform-checkbox {
  margin-right: 20px;
}
.el-icon-plus {
  cursor: pointer;
  font-size: 1.2em;
  padding: 10px;

  &:hover {
    font-weight: bold;
  }
}
.promotion-target {
  & > header {
    & > p {
      font-size: 0.88em;
      color: #333;
      display: inline-block;
      margin-left: 20px;
      font-weight: normal;
    }
    & a {
      margin-left: 10px;
      cursor: pointer;
      color: rgb(21, 164, 250);
    }
  }
  .industryTip {
    margin-left: 20px;
    font-size: 16px;
    color: #ff7533;
    cursor: pointer;
  }
}

</style>

<style lang="scss">
.kw-tag-container {
  & > .kw-tag-fh {
    & > .el-tag__close {
      color: #16b7ff;
      &:hover {
        background: #16b7ff;
        color: #fff;
      }
    }
  }
}
</style>
<style lang="scss">
.industry-class {
     & .el-cascader-node {
      & > .el-radio {
          visibility: hidden;
          cursor: pointer;
        }
      }
}
</style>
