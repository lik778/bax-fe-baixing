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
              <el-radio-group v-model="newPromotion.landingType" size="small">
                <el-radio-button v-for="option of extendLandingTypeOpts" :key="option.value" :label="option.value">{{option.label}}</el-radio-button>
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

              <qiqiaoban-page-selector
                v-if="newPromotion.landingType === LANDING_TYPE_GW"
                :value="newPromotion.landingPage"
                @change="v => setLanding(LANDING_TYPE_GW, v)"
              />

              <ka-258-selector
                v-if="newPromotion.landingType === LANDING_TYPE_258"
                :value="newPromotion.landingPage"
                @change="v => setLanding(LANDING_TYPE_258, v)"
              />

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
        <p class="tip">请选取20个以上关键词，关键词越多您的创意被展现的机会越多。根据当月数据，为您推荐如下关键词</p>
        <el-button type="primary" style="margin-top:10px" size="small" 
                   @click="addKeywordsDialog = true">批量添加关键词</el-button>
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
  </div>
</template>

<script>
import Vue from 'vue'
import { Message } from 'element-ui'
import uuid from 'uuid/v4'
import clone from 'clone'

import PromotionCreativeTip from 'com/widget//promotion-creative-tip'
import PromotionAreaLimitTip from 'com/widget/promotion-area-limit-tip'
import QiqiaobanPageSelector from 'com/common/qiqiaoban-page-selector'
import PromotionChargeTip from 'com/widget/promotion-charge-tip'
import PromotionRuleLink from 'com/widget/promotion-rule-link'
import UserAdSelector from 'com/common/user-ad-selector'
import CreativeEditor from 'com/widget/creative-editor'
import Ka258Selector from 'com/common/ka-258-selector'
import AreaSelector from 'com/common/area-selector'
import ChargeDialog from 'com/common/charge-dialog'
import CpcPriceTip from 'com/widget/cpc-price-tip'
import ContractAck from 'com/widget/contract-ack'
import wxBindModal from 'com/common/wx-bind-modal'
import FmTip from 'com/widget/fm-tip'
import qwtAddKeywordsDialog from 'com/common/qwt-add-keywords-dialog'
import BaxInput from 'com/common/bax-input'

import dayjs from 'dayjs'
import { default as track, trackRecommendService } from 'util/track'

import {
  assetHost
} from 'config'

import {
  f2y,
  toFloat,
  isQwtEnableCity,
  fmtAreasInQwt,
  getCnName,
  getCampaignPrediction
} from 'util'

import {
  createCampaign
} from 'api/fengming'

import {
  queryAds
} from 'api/fengming'

import {
  SEM_PLATFORM_SHENMA,
  landingTypeOpts,
  semPlatformOpts,
  LANDING_TYPE_AD,
  LANDING_TYPE_GW,
  LANDING_TYPE_258,
  RECOMMAND_SOURCE_FH,
  NEW_RECOMMAND_SOURCE_FH
} from 'constant/fengming'

import {allowSee258} from 'util/fengming-role'

import {
  MIN_WORD_PRICE,
  MAX_WORD_PRICE
} from 'constant/keyword'

import { keywordPriceTip } from 'constant/tip'

import store from './store'

const MVP_AD = 0

const RECOMMAND_SOURCES = [RECOMMAND_SOURCE_FH, NEW_RECOMMAND_SOURCE_FH]

const MIN_DAILY_BUDGET = 100 * 100

// 因为搜狗渠道账号, 暂时去掉搜狗账号
const removeSogouChannel = (semPlatformOpts) => {
    // 搜狗value=5
    return semPlatformOpts.filter(opt => opt.value !== 5)
}

const promotionTemplate = {
  landingType: 0,
  landingPage: '',
  landingPageId: '',
  areas: [],

  creativeTitle: '',
  creativeContent: '',

  keywords: [],
  sources: removeSogouChannel(semPlatformOpts).map(opt => opt.value),
  dailyBudget: MIN_DAILY_BUDGET
}

export default {
  name: 'qwt-create-promotion',
  components: {
    PromotionCreativeTip,
    PromotionAreaLimitTip,
    QiqiaobanPageSelector,
    PromotionChargeTip,
    PromotionRuleLink,
    UserAdSelector,
    CreativeEditor,
    Ka258Selector,
    AreaSelector,
    ChargeDialog,
    ContractAck,
    CpcPriceTip,
    FmTip,
    qwtAddKeywordsDialog,
    BaxInput
  },
  fromMobx: {
    searchRecommends: () => store.searchRecommends,
    urlRecommends: () => store.urlRecommends,

    currentBalance: () => store.currentBalance,
    campaignsCount: () => store.campaignsCount,
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    },
    allAreas: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      newPromotion: clone(promotionTemplate),
      actionTrackId: uuid(),
      queryWord: '',
      creativeError: null,
      kwPrice: 0,
      LANDING_TYPE_AD,
      LANDING_TYPE_GW,
      LANDING_TYPE_258,
      RECOMMAND_SOURCES,

      searchRecommendsVisible: false,
      chargeDialogVisible: false,
      areaDialogVisible: false,

      semPlatformOpts: removeSogouChannel(semPlatformOpts),
      isCreating: false,
      showPromotion: false,
      timeout: null,

      // PRE_IMG_PROMOTION: assetHost + 'promotion-advantage.png'
      PRE_IMG_PROMOTION: '//file.baixing.net/201809/a995bf0f1707a3e98a2c82a5dc5f8ad3.png',
      addKeywordsDialog: false
    }
  },
  computed: {
    extendLandingTypeOpts() {
      if (allowSee258(null, this.userInfo.id)) {
        return landingTypeOpts.concat([{label: '258官网', value: LANDING_TYPE_258}])
      }
      return landingTypeOpts
    },
    isShenmaChecked() {
      return this.newPromotion.sources.includes(SEM_PLATFORM_SHENMA)
    },

    adSelectorType() {
      return this.$route.query.adId ? 'reselect' : ''
    },
    predictedInfo() {
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
        days:  (tempPredictedInfo.days / sourcesLen) | 0
      }
    },

    recommendKwPrice() {
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
    f2y,
    updatePromotionKeywords(kwAddResult) {
      this.addKeywordsDialog = false

      if (!kwAddResult) return
      let { normalList, bannedList} = kwAddResult
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

      let { keywords } = this.newPromotion
      this.newPromotion.keywords = keywords.concat(normalList)
    },
    handleCreativeValueChange({title, content}) {
        this.newPromotion.creativeTitle = title
        this.newPromotion.creativeContent = content
    },
    handleCreativeError(message) {
      if(message) Message.error(message)
      this.creativeError = message
    },
    fetchRecommends(query, cb) {
      query = query.trim()
      if (query) {
        const {areas, sources} = this.newPromotion
        store.recommendByWord(query, {areas, sources}).then(
          () => {
            cb(this.searchRecommends)
          }
        )
      }
    },
    selectRecommend(item) {
      const { keywords } = this.newPromotion
      if (keywords.find(kw => kw.word === item.word)) {
        Message.warning('该关键词已存在')
      } else {
        keywords.push(item)
        this.queryWord = ''
      }
    },

    removeKeyword(index) {
      this.newPromotion.keywords.splice(index, 1)
    },

    onKwPriceChange(val) {
      this.kwPrice = toFloat(val) * 100
    },

    onBudgetChange(val) {
      this.newPromotion.dailyBudget = toFloat(val) * 100
    },

    setLanding(type, url) {
      this.newPromotion.landingType = type
      this.newPromotion.landingPage = url
    },

    async onSelectAd(ad) {
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

    trackPromotionKeywords(promotionIds, promotion) {
      // 凤凰于飞推荐词列表
      const recommendKeywords = this.urlRecommends
        .filter(({recommandSource}) => RECOMMAND_SOURCES.includes(recommandSource))
        .map(({word, recommandSource}) => `${word}_${recommandSource}`)
        .join(',')
      
      const selectedKeywords = promotion.keywords
        .map(({word, recommandSource = 'user_selected'}) => `${word}=${recommandSource}`)
        .join(',')
      
      const dailyBudget = promotion.dailyBudget / 100
      const landingPage = promotion.landingPage

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

    async createPromotion() {
      if (!this.$refs.contract.$data.isAgreement) {
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

      try {
        await this._createPromotion(promotion)
      } finally {
        this.isCreating = false
      }
    },

    async _createPromotion(p) {
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

      if (!p.keywords.length) {
        return Message.error('请填写关键字')
      }

      if (p.keywords.length < 20) {
        return Message.error('请至少添加20个投放关键词')
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
      const promotionIds = await createCampaign(fmtAreasInQwt(p, allAreas))
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

    async recommendByUrl(opts = {}) {
      let { landingType, landingPage, areas } = this.newPromotion
      landingPage = opts.landingPage || landingPage
      const reqBody = {
        ...opts,
        url: landingPage,
        landingType: opts.landingType || landingType,
        areas: opts.areas || areas,
      }

      if (landingPage) {
        await store.recommendByUrl(reqBody)
        this.newPromotion.keywords = clone(this.urlRecommends)
      }
    },
    gotoPromotionList() {
      this.chargeDialogVisible = false

      this.$router.push({
        name: 'qwt-promotion-list'
      })
    },

    onLandingTypeChange(typeId) {
      const { landingType } = this.newPromotion
      if (landingType === typeId) {
        return
      }

      this.newPromotion.landingType = typeId

      if ([1, 4].includes(typeId)) {
        this.newPromotion.landingPage = ''
      }
    },

    async onChangeAreas(areas) {
      this.newPromotion.areas = [...areas]
      this.areaDialogVisible = false
      if (this.newPromotion.landingType !== LANDING_TYPE_GW) {
        await this.recommendByUrl()
      }
    },

    formatterArea(name) {
      const { allAreas } = this
      return getCnName(name, allAreas)
    },

    async removeArea(c) {
      this.newPromotion.areas = [
        ...this.newPromotion.areas.filter(i => i !== c)
      ]
      if (this.newPromotion.landingType !== LANDING_TYPE_GW) {
        await this.recommendByUrl()
      }
    },
    handleWxModalClose() {
      this.isWxModalVisible =false
    },
    openWxModal() {
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

    async cloneCampaignById(campaignId) {
      const originPromotion = await store.getCampaignInfo(campaignId)
      const clonedPromotion = {}
      let ad = null
      // 判断源计划落地页类型是主站广告或者官网
      if (originPromotion.landingType === MVP_AD) {
        // 官网
        const result = await queryAds({
          limitMvp: false,
          adIds: [originPromotion.landingPageId],
          limit: 1
        })
        ad = result.ads && result.ads[0]
        if (ad) {
          clonedPromotion.landingPage = ad.url
          await this.$refs.userAdSelector.reset('selected', ad.adId)
        }
      }
      Object.keys(promotionTemplate).map(key => {
        if (ad && key === 'landingPage') return
        clonedPromotion[key] = originPromotion[key]
      })
      clonedPromotion.landingPageId = originPromotion.landingPageId.toString()
      clonedPromotion.creativeTitle = originPromotion.creative.title
      clonedPromotion.creativeContent = originPromotion.creative.content
      clonedPromotion.sources = []
      this.newPromotion = clonedPromotion
    },
    async getRecommendKeywords() {
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
    }
  },

  async mounted() {
    await Promise.all([
      store.getCurrentBalance(),
      store.getCampaignsCount()
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
        adIds: [adId],
        limit: 1
      })
      const ad = result.ads && result.ads[0]
      if (ad) {
        await this.onSelectAd(ad)
      }
    }
  },

  beforeDestroy() {
    store.clearStore()
  },

  destroyed() {
    clearTimeout(this.timeout)
  },
  watch: {
    'newPromotion.landingType'(newVal, oldVal) {
      this.newPromotion.landingPage = ''
      this.newPromotion.landingPageId = ''
    }
  }
}
</script>

<style scoped lang="postcss">
@import 'cssbase/mixin';

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
      box-shadow: 0 2px 9px 0 rgba(83,95,127,0.10);
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
  color: #16B7FF;
  background: #ecf5ff;
  border-color: #b3d8ff;
}
.kw-tag-container {
  max-width: 100%;
  display: flex;
  flex-wrap: wrap;
  & /deep/ .el-input__inner{
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
  & > header  {
    & > p {
      font-size: .88em;
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
}
</style>

<style lang="postcss">
.kw-tag-container {
  & > .kw-tag-fh {
    & > .el-tag__close {
      color: #16B7FF;
      &:hover {
        background: #16B7FF;
        color: #fff;
      }
    }
  }
}
</style>
