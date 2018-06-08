
<template>
  <div class="qwt-create-promotion">
    <topbar :user-info="userInfo">
      <label slot="title">全网通 - 新建推广</label>
    </topbar>
    <main>
      <section>
        <header>推广目标设置</header>
        <div>
          <aside>选择渠道：</aside>
          <span class="select-source">
            <el-popover
              ref="popover-baidu-preview"
              placement="bottom-start"
              trigger="hover"
            >
              <div class="source-preview">
                <h3>效果示例：电脑端</h3>
                <img :src="PRE_IMG_BAIDU_PC" />
                <h3>效果示例：手机端</h3>
                <img :src="PRE_IMG_BAIDU_WAP" />
              </div>
            </el-popover>
            <el-popover
              ref="popover-sougou-preview"
              placement="bottom-start"
              trigger="hover"
            >
              <div class="source-preview">
                <h3>效果示例：电脑端</h3>
                <img :src="PRE_IMG_SOGOU_PC" />
                <h3>效果示例：手机端</h3>
                <img :src="PRE_IMG_SOGOU_WAP" />
              </div>
            </el-popover>
            <el-popover
              ref="popover-360-preview"
              placement="bottom-start"
              trigger="hover"
            >
              <div class="source-preview">
                <h3>效果示例：电脑端</h3>
                <img :src="PRE_IMG_360_PC" />
              </div>
            </el-popover>
            <el-popover
              ref="popover-shenma-preview"
              placement="bottom-start"
              trigger="hover"
            >
              <div class="source-preview">
                <h3>效果示例：移动端首位样式</h3>
                <img :src="PRE_IMG_SHENMA_WAP_TOP" />
                <h3>效果示例：移动端非首位样式</h3>
                <img :src="PRE_IMG_SHENMA_WAP_NOT_TOP" />
              </div>
            </el-popover>
            <el-button-group>
              <el-button
                v-popover:popover-baidu-preview
                :type="newPromotion.source === SEM_PLATFORM_BAIDU ? 'primary' : ''"
                @click="newPromotion.source = SEM_PLATFORM_BAIDU"
              >
                百度
              </el-button>
              <el-button
                v-popover:popover-sougou-preview
                :type="newPromotion.source === SEM_PLATFORM_SOGOU ? 'primary' : ''"
                @click="newPromotion.source = SEM_PLATFORM_SOGOU"
              >
                搜狗
              </el-button>
              <el-button
                v-popover:popover-360-preview
                :type="newPromotion.source === SEM_PLATFORM_QIHU ? 'primary' : ''"
                @click="newPromotion.source = SEM_PLATFORM_QIHU"
              >
                360
              </el-button>
              <el-button
                v-popover:popover-shenma-preview
                :type="newPromotion.source === SEM_PLATFORM_SHENMA ? 'primary' : ''"
                @click="newPromotion.source = SEM_PLATFORM_SHENMA"
              >
                神马
              </el-button>
            </el-button-group>
          </span>
          <promotion-rule-link />
          <i
            v-if="newPromotion.source === SEM_PLATFORM_SHENMA"
            class="warning"
          >
            神马渠道仅支持移动端
          </i>
        </div>
        <div>
          <aside style="align-items: flex-start; padding-top: 5px;">
            投放页面：
          </aside>
          <span class="landingpage">
            <div>
              <el-button-group>
                <el-button v-for="o of landingTypeOpts" :key="o.value"
                  @click="onLandingTypeChange(o.value)"
                  :type="newPromotion.landingType === o.value ? 'primary' : ''">
                  {{ o.label }}
                </el-button>
              </el-button-group>
            </div>
            <div style="margin-top: 20px; width: 560px;">
              <user-ad-selector :type="adSelectorType"
                v-if="newPromotion.landingType === 0"
                :all-areas="allAreas" :limit-mvp="false"
                :selected-id="newPromotion.landingPageId"
                @select-ad="ad => onSelectAd(ad)">
              </user-ad-selector>

              <qiqiaoban-page-selector
                v-if="newPromotion.landingType === 1"
                :value="newPromotion.landingPage"
                @change="setLandingPage">
              </qiqiaoban-page-selector>
            </div>
          </span>
        </div>
        <div>
          <aside>投放城市：</aside>
          <span>
            <el-tag type="success" closable
              v-for="c in newPromotion.areas" :key="c"
              @close="removeArea(c)">
              {{ formatterArea(c) }}
            </el-tag>
            <i class="el-icon-plus"
              @click="areaDialogVisible = true">
            </i>
          </span>
        </div>
        <promotion-area-limit-tip :all-areas="allAreas"
          :selected-areas="newPromotion.areas">
        </promotion-area-limit-tip>
        <div>
          <aside>投放时段：</aside>
          <span>
            <label class="duration-type">
              {{ getDurationType() }}
            </label>
            <el-button type="primary" size="small"
              @click="durationSelectorVisible = true">
              设置
            </el-button>
          </span>
        </div>
      </section>
      <creative-editor
        :platform="newPromotion.source"
        :title="newPromotion.creativeTitle"
        :content="newPromotion.creativeContent"
        @change-title="v => newPromotion.creativeTitle = v"
        @change-content="v => newPromotion.creativeContent = v"
      />
      <section class="keyword">
        <header>选取推广关键词</header>
        <h4 v-if="!isCopy">建议选取20个以上关键词，关键词越多您的创意被展现的机会越多。根据当月数据，为您推荐如下关键词</h4>
        <keyword-list mode="select"
          :platform="newPromotion.source"
          :words="creativeWords"
          :offset="creativeWordsOffset"
          :selected-words="newPromotion.creativeWords"
          :show-prop-show="!isCopy"
          @update-word="updateCreativeWord"
          @change-offset="offset => creativeWordsOffset = offset"
          @select-words="words => newPromotion.creativeWords = words"
          @operated-pages="pages => operatedPages = pages">
        </keyword-list>
        <h3>
          <label>若没有您满意的关键词，</label>
          <a @click="switchWordsVisible">点此自定义添加</a>
        </h3>
        <div class="recommend"
          v-if="recommendedWordsVisible">
          <span>
            <el-input placeholder="请输入关键词" v-model.trim="queryWord">
            </el-input>
          </span>
          <el-button type="primary" @click="queryRecommendedWords">
            查询
          </el-button>
          <strong>
            （请优先添加较为核心的关键词，关键词长度不宜超过5个字，不区分大小写。）
          </strong>
        </div>
        <keyword-list
          v-if="recommendedWordsVisible"
          mode="select"
          :platform="newPromotion.source"
          :words="addibleWords"
          :offset="addibleWordsOffset"
          :selected-words="newPromotion.recommendedWords"
          @update-word="updateRecommendedWord"
          @change-offset="setAddibleWordsOffset"
          @select-words="words => newPromotion.recommendedWords = words">
        </keyword-list>
        <div
          v-if="newPromotion.source !== SEM_PLATFORM_SHENMA"
          class="mobile-ratio"
        >
          <section>
            选择投放移动端的出价比例
          </section>
          <section>
            <span>
              <el-input
                placeholder="默认为1"
                v-model="newPromotion.mobilePriceRatio"
              />
            </span>
            <span>
              (请输入 0.1-9.9 之间的数字)
            </span>
          </section>
          <promotion-mobile-ratio-tip />
        </div>
      </section>
      <section class="timing">
        <header>设置时长和预算</header>
        <div>
          <aside>投放时间:</aside>
          <span>
            <el-button-group>
              <el-button :type="timeType === 'long' ? 'primary' : ''"
                @click="timeType = 'long'">
                长期投放
              </el-button>
              <el-button :type="timeType === 'custom' ? 'primary' : ''"
                @click="timeType = 'custom'">
                定时投放
              </el-button>
            </el-button-group>
          </span>
          <span>
            <el-date-picker v-if="timeType === 'custom'"
              type="daterange" placeholder="选择日期范围"
              :picker-options="{disabledDate}"
              v-model="newPromotion.validTime">
            </el-date-picker>
          </span>
        </div>
        <div>
          <aside>设置推广日预算:</aside>
          <span>
            <el-input type="number" placeholder="请输入每日最高预算"
              v-model="newPromotion.dailyBudget">
            </el-input>
          </span>
          <i>元</i>
          <span>
            （根据您选取的关键词，最低预算为<p>{{ predictedInfo.dailyBudget }}</p>元）
          </span>
        </div>
        <h3>
          {{ `您的推广资金余额：￥${ (currentBalance / 100).toFixed(2) } 元，可消耗` }}
          <strong>{{ predictedInfo.duration }}</strong>天
        </h3>
        <contract-ack type="content-rule"></contract-ack>
        <div>
          <el-button v-if="false" type="primary">
            先去充值
          </el-button>
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
      @cancel="areaDialogVisible = false">
    </area-selector>
    <duration-selector
      :visible="durationSelectorVisible"
      :platform="newPromotion.source"
      :schedule="getCurrentSchedule()"
      @change="onChangeDuration"
      @hide="durationSelectorVisible = false">
    </duration-selector>
    <copy-campaign-dialog
      :visible="copyDialogVisible"
      :platform="newPromotion.source"
      @cancel="gotoPromotionList"
      @copy="copyCampaign" />
    <charge-dialog
      :visible="chargeDialogVisible"
      @cancel="gotoPromotionList" />
  </div>
</template>

<script>
import { Message } from 'element-ui'
import uuid from 'uuid/v4'
import clone from 'clone'

import PromotionMobileRatioTip from 'com/widget/promotion-mobile-ratio-tip'
import PromotionAreaLimitTip from 'com/widget/promotion-area-limit-tip'
import QiqiaobanPageSelector from 'com/common/qiqiaoban-page-selector'
import PromotionChargeTip from 'com/widget/promotion-charge-tip'
import CopyCampaignDialog from 'com/common/copy-campaign-dialog'
import PromotionRuleLink from 'com/widget/promotion-rule-link'
import DurationSelector from 'com/common/duration-selector'
import UserAdSelector from 'com/common/user-ad-selector'
import CreativeEditor from 'com/widget/creative-editor'
import KeywordList from 'com/common/qwt-keyword-list'
import AreaSelector from 'com/common/area-selector'
import ChargeDialog from 'com/common/charge-dialog'
import ContractAck from 'com/widget/contract-ack'
import FlatBtn from 'com/common/flat-btn'
import Topbar from 'com/topbar'

import { disabledDate } from 'util/element'
import track from 'util/track'
import {
  getCreativeContentLenLimit,
  getCreativeTitleLenLimit,
  checkCampaignValidTime,
  getCampaignPrediction,
  getCampaignValidTime
} from 'util/campaign'
import {
  isQwtEnableCity,
  fmtAreasInQwt,
  getCnName
} from 'util/meta'
import {
  toHumanTime
} from 'utils'

import {
  checkCreativeContent,
  getCampaignInfo,
  createCampaign
} from 'api/fengming'

import {
  queryAds
} from 'api/fengming-mvp'

import {
  SEM_PLATFORM_SHENMA,
  SEM_PLATFORM_BAIDU,
  SEM_PLATFORM_SOGOU,
  SEM_PLATFORM_QIHU,
  LANDING_TYPE_AD,
  landingTypeOpts
} from 'constant/fengming'

import {
  assetHost
} from 'config'

import store from './store'

const emptyPromotion = {
  mobilePriceRatio: 1,
  creativeContent: '',
  creativeTitle: '',
  dailyBudget: 100, // 元
  landingPageId: '',
  landingPage: '',
  landingType: 0,
  validTime: [],
  keywords: [],
  areas: [],
  source: SEM_PLATFORM_BAIDU,
  //
  recommendedWords: [],
  creativeWords: []
}

const MODE_COPY = 'copy'

export default {
  name: 'qwt-create-promotion',
  components: {
    PromotionMobileRatioTip,
    PromotionAreaLimitTip,
    QiqiaobanPageSelector,
    PromotionChargeTip,
    CopyCampaignDialog,
    PromotionRuleLink,
    DurationSelector,
    UserAdSelector,
    CreativeEditor,
    AreaSelector,
    ChargeDialog,
    KeywordList,
    ContractAck,
    FlatBtn,
    Topbar
  },
  fromMobx: {
    recommendedWords: () => store.recommendedWords,
    creativeWords: () => store.creativeWords,

    currentBalance: () => store.currentBalance,
    campaignsCount: () => store.campaignsCount
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
      newPromotion: clone(emptyPromotion),
      actionTrackId: uuid(),
      timeType: 'long', // long, custom
      queryWord: '',

      recommendedWordsVisible: false,
      durationSelectorVisible: false,
      chargeDialogVisible: false,
      copyDialogVisible: false,
      areaDialogVisible: false,

      creativeWordsOffset: 0,
      addibleWordsOffset: 0,
      createdCampaignId: 0,
      operatedPages: [], // for logging

      landingTypeOpts,

      isCreating: false,

      showPromotion: false,
      timeout: null,

      PRE_IMG_SHENMA_WAP_NOT_TOP: assetHost + 'example-shenma-wap-not-top.jpeg',
      PRE_IMG_SHENMA_WAP_TOP: assetHost + 'example-shenma-wap-top.jpeg',
      PRE_IMG_SOGOU_WAP: assetHost + 'example-sougou-wap.png',
      PRE_IMG_SOGOU_PC: assetHost + 'example-sougou-pc.png',
      PRE_IMG_BAIDU_WAP: assetHost + 'example-baidu-wap.png',
      PRE_IMG_BAIDU_PC: assetHost + 'example-baidu-pc.png',
      PRE_IMG_360_PC: assetHost + 'example-360-pc.png',

      SEM_PLATFORM_SHENMA,
      SEM_PLATFORM_BAIDU,
      SEM_PLATFORM_SOGOU,
      SEM_PLATFORM_QIHU
    }
  },
  computed: {
    adSelectorType() {
      const adId = this.$route.query.adId
      if (adId) {
        return 'reselect'
      }

      if ((this.newPromotion.landingType === LANDING_TYPE_AD) &&
        this.isCopy) {
        return 'reselect'
      }

      return ''
    },
    isFirstCampaign() {
      return this.campaignsCount === 0
    },
    predictedInfo() {
      const {
        currentBalance,
        newPromotion
      } = this

      const {
        recommendedWords,
        creativeWords
      } = newPromotion

      const prices = [...recommendedWords, ...creativeWords]
        .map(k => k.price)

      return getCampaignPrediction(currentBalance, prices)
    },
    addibleWords() {
      const words = this.creativeWords.map(w => w.word.toLowerCase())

      return this.recommendedWords
        .filter(w => !words.includes(w.word.toLowerCase()))
    },
    isCopy() {
      return this.$route.query.mode === MODE_COPY
    }
  },
  methods: {
    setAddibleWordsOffset(offset) {
      this.addibleWordsOffset = offset
    },
    async setLandingPage(url) {
      this.newPromotion.landingPage = url
      this.newPromotion.areas = ['quanguo']
      await this.getCreativeWords()
    },
    async onSelectAd(ad) {
      const { allAreas } = this

      if (isQwtEnableCity(ad.city, allAreas)) {
        this.newPromotion.areas = [ad.city]
      }

      this.newPromotion.landingPageId = ad.adId
      this.newPromotion.landingPage = ad.url

      this.newPromotion.creativeTitle = ad.title && ad.title.slice(0, 24)
      this.newPromotion.creativeContent = ad.content && ad.content.slice(0, 39)

      await this.getCreativeWords()
    },
    getCurrentSchedule() {
      const { schedule } = this.newPromotion
      return Array.isArray(schedule)
        ? schedule.join(',')
        : schedule
    },
    getDurationType() {
      const { schedule } = this.newPromotion
      if (!schedule) {
        return '全时段'
      }

      const sum = schedule.reduce((a, b) => a + b, 0)

      if (this.newPromotion.source === SEM_PLATFORM_SOGOU) {
        return sum < 3670009 ? '部分时段' : '全时段'
      }

      return sum < 117440505 ? '部分时段' : '全时段'
    },
    async createPromotion() {
      if (this.isCreating) {
        return Message.warning('正在创建中, 请稍等一小会 ~')
      }

      this.isCreating = true

      const { actionTrackId, userInfo } = this

      track({
        roles: userInfo.roles.map(r => r.name).join(','),
        action: 'click-button: create-campaign',
        baixingId: userInfo.baixingId,
        time: Date.now() / 1000 | 0,
        baxId: userInfo.id,
        actionTrackId,
        creativeWords: this.creativeWords.length,
        selectedCreativeWords: this.newPromotion.creativeWords.length,
        creativeWordPages: this.operatedPages.join(',')
      })

      try {
        await this._createPromotion()
      } finally {
        this.isCreating = false
      }
    },
    async _createPromotion() {
      const { currentBalance, allAreas } = this

      const p = clone(this.newPromotion)

      const pp = this.predictedInfo.dailyBudget
      if (p.dailyBudget < pp) {
        throw Message.error(`推广日预算需大于 ${pp} 元`)
      }
      if (p.dailyBudget > 10000000) {
        throw Message.error('推广日预算太高啦！您咋这么土豪呢~')
      }

      p.dailyBudget = p.dailyBudget * 100

      if (this.timeType === 'custom') {
        if (checkCampaignValidTime(p.validTime) === 'custom') {
          p.validTime = getCampaignValidTime(p.validTime)
        } else {
          throw Message.error('请填写投放日期或选择长期投放')
        }
      } else {
        p.validTime = [null, null]
      }

      p.keywords = [
        ...p.recommendedWords,
        ...p.creativeWords
      ]

      p.mobilePriceRatio = parseFloat(p.mobilePriceRatio)
      if (!(p.mobilePriceRatio >= 0.1 && p.mobilePriceRatio <= 9.9)) {
        throw Message.error('请设置合理的移动端出价比例')
      }

      if (!p.landingPage) {
        throw Message.error('请填写投放页面')
      }

      if (!p.keywords.length) {
        throw Message.error('请填写关键字')
      }

      for (const w of p.keywords) {
        // if (w.price * 2 < w.originPrice) {
        //   return Message.error(`关键字: ${w.word} 出价低于 ${(w.originPrice / 200).toFixed(2)}, 请调高出价`)
        // }
        if (w.price < 100) {
          throw Message.error(`关键字: ${w.word} 出价不得低于 1元, 请调高出价`)
        }
      }

      if (!p.areas.length) {
        throw Message.error('请选择城市')
      }

      if (!p.creativeTitle) {
        throw Message.error('请填写创意标题')
      }

      let [min, max] = getCreativeTitleLenLimit(p.source)
      if (p.creativeTitle.length < min ||
        p.creativeTitle.length > max) {
        throw Message.error(`创意标题需要在${min}-${max}个字`)
      }

      if (!p.creativeContent) {
        throw Message.error('请填写创意内容')
      }

      [min, max] = getCreativeContentLenLimit(p.source)
      if (p.creativeContent.length < min ||
        p.creativeContent.length > max) {
        throw Message.error(`创意内容需要在${min}-${max}个字`)
      }

      const res = await checkCreativeContent({
        creativeContent: p.creativeContent,
        creativeTitle: p.creativeTitle,
        platform: p.source
      })

      if (res.result) {
        throw Message.error(res.hint)
      }

      const id = await createCampaign(fmtAreasInQwt(p, allAreas))
      this.createdCampaignId = id

      Message.success('创建成功')

      store.clearStore()

      if (p.dailyBudget > currentBalance) {
        this.chargeDialogVisible = true
      } else {
        this.copyDialogVisible = true
      }
    },
    async queryRecommendedWords() {
      const { queryWord } = this

      if (!queryWord) {
        return Message.error('请输入查询关键词')
      }

      const preLength = this.addibleWords.length
      await store.getRecommendedWords(queryWord)
      this.addibleWordsOffset = preLength
    },
    async checkCreativeContent() {
      const {
        creativeContent,
        creativeTitle,
        source
      } = this.newPromotion

      if (!creativeContent) {
        return Message.error('请填写推广内容')
      }

      if (!creativeTitle) {
        return Message.error('请填写推广标题')
      }

      const data = await checkCreativeContent({
        platform: source,
        creativeContent,
        creativeTitle
      })

      if (!data.result) {
        Message.success(data.hint)
      } else {
        return Message.error(data.hint)
      }
    },
    updateRecommendedWord(word) {
      this.newPromotion.recommendedWords = this.newPromotion.recommendedWords.map(w => {
        if (w.word === word.word) {
          return {
            ...w,
            price: word.price
          }
        } else {
          return {...w}
        }
      })
    },
    updateCreativeWord(word) {
      this.newPromotion.creativeWords = this.newPromotion.creativeWords.map(w => {
        if (w.word === word.word) {
          return {
            ...w,
            price: word.price
          }
        } else {
          return w
        }
      })
    },
    async getCreativeWords(newLandingPage = this.newPromotion.landingPage) {
      if (newLandingPage) {
        await store.getCreativeWords(newLandingPage)
      }
    },
    gotoPromotionList() {
      this.chargeDialogVisible = false

      this.$router.push({
        name: 'qwt-promotion-list'
      })
    },
    switchWordsVisible() {
      this.recommendedWordsVisible = !this.recommendedWordsVisible
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
    onChangeAreas(areas) {
      this.newPromotion.areas = [...areas]
      this.areaDialogVisible = false
    },
    onChangeDuration(durations) {
      this.newPromotion.schedule = durations
    },
    formatterArea(name) {
      const { allAreas } = this
      return getCnName(name, allAreas)
    },
    removeArea(c) {
      this.newPromotion.areas = [
        ...this.newPromotion.areas.filter(i => i !== c)
      ]
    },
    async copyExistCampaignInfo(campaignId) {
      const info = await getCampaignInfo(campaignId)

      this.newPromotion.creativeContent = info.creative.content
      this.newPromotion.creativeTitle = info.creative.title

      if (info.landingPageId) {
        // landingPageId === 0, 保存为 ''
        this.newPromotion.landingPageId = String(info.landingPageId)
      }
      this.newPromotion.landingPage = info.landingPage
      this.newPromotion.landingType = info.landingType

      this.newPromotion.mobilePriceRatio = info.mobilePriceRatio
      this.newPromotion.dailyBudget = info.dailyBudget / 100 | 0
      this.newPromotion.source = this.$route.query.platform | 0
      this.newPromotion.validTime = info.validTime
      this.newPromotion.areas = info.areas

      let timeType = ''

      if (info.timeRange && info.timeRange.length &&
        (info.timeRange[0] !== null) &&
        (info.timeRange[1] !== null)) {
        info.validTime = [
          toHumanTime(info.timeRange[0], 'YYYY-MM-DD'),
          toHumanTime(info.timeRange[1], 'YYYY-MM-DD')
        ]

        timeType = 'custom'
      } else {
        info.validTime = []
        timeType = 'long'
      }

      this.timeType = timeType

      const words = info.keywords
        .map(k => ({
          ...k,
          ...k.extra
        }))

      this.newPromotion.creativeWords = clone(words)
      store.setCreativeWords(clone(words))
    },
    copyCampaign({platform}) {
      this.$router.push({
        name: 'bax-redirect-page',
        query: {
          campaignId: this.createdCampaignId,
          targetPage: 'qwt-create-promotion',
          mode: MODE_COPY,
          platform
        }
      })
    },
    disabledDate
  },
  async mounted() {
    await Promise.all([
      store.getCurrentBalance(),
      store.getCampaignsCount()
    ])

    const { adId, mode, campaignId } = this.$route.query
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

    if (mode === MODE_COPY && campaignId) {
      await this.copyExistCampaignInfo(campaignId)
    }

    setTimeout(() => {
      const { actionTrackId, userInfo } = this

      track({
        roles: userInfo.roles.map(r => r.name).join(','),
        action: 'enter-page: create-campaign',
        baixingId: userInfo.baixingId,
        time: Date.now() / 1000 | 0,
        baxId: userInfo.id,
        actionTrackId
      })
    }, 800)
  },
  beforeDestroy() {
    store.clearStore()
  },
  destroyed() {
    clearTimeout(this.timeout)
  }
}
</script>

<style scoped>
@import 'cssbase/mixin';

.el-icon-plus {
  cursor: pointer;
}

.el-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.duration-type {
  color: #6a778c;
  font-size: 14px;
}

.select-source {
  display: flex;
  align-items: center;
  width: 280px;
}

.source-preview {
  width: 340px;
  display: flex;
  flex-flow: column;

  & > h3 {
    margin: 5px 0 10px;
  }

  & > img {
    width: 330px;
    height: auto;
  }
}

.qwt-create-promotion {
  padding: 0 35px;
  width: 100%;

  & > main {
    & > section:not(:last-child) {
      border-bottom: 1px solid #c0ccda;
    }

    & > section {
      margin-bottom: 30px;
      padding-bottom: 10px;

      & > header {
        color: #6a778c;
      }

      & > div {
        display: flex;
        margin: 20px 0;

        & > aside:first-child {
          display: flex;
          align-items: center;
          min-width: 70px;
          margin-right: 20px;
          color: #6a778c;
          font-size: 14px;
        }
      }
    }

    & > section.keyword {
      & > h4 {
        margin: 20px 0 30px;
        color: #6a778c;
        font-size: 13px;
        font-weight: normal;
      }

      & > h3 {
        font-size: 14px;
        font-weight: normal;

        & > label {
          color: #424344;
        }

        & > a {
          color: #0994ff;
          cursor: pointer;
        }
      }

      & > div.recommend {
        display: flex;
        align-items: center;

        & > span {
          margin-right: 20px;
        }

        & > strong {
          color: #404e61;
          font-size: 13px;
          font-weight: normal;
        }
      }

      & > div.mobile-ratio {
        display: block;

        & > section:first-child {
          font-size: 14px;
          line-height: 1;
          color: #424344;
        }

        & > section:nth-child(2) {
          margin-top: 16px;

          & > span:last-child {
            margin-left: 14px;
            font-size: 13px;
            color: #404e61;
          }
        }
      }
    }

    & > section.timing {
      & > div {
        display: flex;
        align-items: center;
      }

      & > div:nth-child(2) {
        & > span:last-child {
          margin-left: 20px;
        }
      }

      & > div:nth-child(3) {
        & > span:nth-child(2) {
          width: 220px;
        }

        & > i {
          margin-left: 5px;
          color: #6a778c;
          font-size: 13px;
        }

        & > span:last-child {
          display: flex;
          align-items: center;
          margin: 0 3px;
          width: 260px;
          font-size: 13px;
          color: #404e61;

          & > p {
            color: red;
          }
        }
      }

      & > h3 {
        color: #6a778c;
        font-size: 14px;
        font-weight: normal;

        & > strong {
          margin: 0 5px;
          color: #ff4401;
          font-size: 18px;
        }
      }
    }
  }
}

.warning {
  @mixin center;
  padding-left: 12px;
  font-size: 12px;
  color: red;
}

.slide-fade-enter-active {
  transition: all .4s ease;
}

.slide-fade-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(100px);
}
</style>
