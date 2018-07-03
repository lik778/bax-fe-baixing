
<template>
  <div class="qwt-update-promotion">
    <topbar :user-info="userInfo">
      <label slot="title">
        <span>全网通 - 更新推广</span>
        <el-button class="report-link" size="mini" type="primary"
          @click="gotoReportPage">
          查看计划报表
        </el-button>
      </label>
    </topbar>
    <main>
      <h3>推广计划: {{ id }}</h3>
      <section>
        <header>推广目标设置</header>
        <div>
          <aside>投放渠道：</aside>
          <span>
            <el-button-group>
              <el-button
                :type="getProp('source') === SEM_PLATFORM_BAIDU ? 'primary' : ''"
                @click="clickSourceTip"
              >
                百度
              </el-button>
              <el-button
                :type="getProp('source') === SEM_PLATFORM_SOGOU ? 'primary' : ''"
                @click="clickSourceTip"
              >
                搜狗
              </el-button>
              <el-button
                :type="getProp('source') === SEM_PLATFORM_QIHU ? 'primary' : ''"
                @click="clickSourceTip"
              >
                360
              </el-button>
              <el-button
                :type="getProp('source') === SEM_PLATFORM_SHENMA ? 'primary' : ''"
                @click="clickSourceTip"
              >
                神马
              </el-button>
            </el-button-group>
          </span>
          <promotion-rule-link />
        </div>
        <div>
          <aside style="align-items: flex-start; padding-top: 5px;">
            投放页面：
          </aside>
          <span class="landingpage">
            <div>
              <el-button-group>
                <el-button v-for="o of landingTypeOpts" :key="o.value"
                  :type="getProp('landingType') === o.value ? 'primary' : ''"
                  @click="clickLandingType(o.value)">
                  {{ o.label }}
                </el-button>
              </el-button-group>
            </div>
            <div style="margin-top: 20px;">
              <user-ad-selector
                v-if="getProp('landingType') === 0"
                type="reselect"
                :disabled="!isCreativeEditable || isFormReadonly"
                :all-areas="allAreas" :limit-mvp="false"
                :selected-id="getProp('landingPageId')"
                @select-ad="ad => onSelectAd(ad)">
              </user-ad-selector>

              <qiqiaoban-page-selector
                v-if="getProp('landingType') === 1"
                :disabled="!isCreativeEditable"
                :value="getProp('landingPage')"
                @change="setLandingPage">
              </qiqiaoban-page-selector>

              <p v-if="!isCreativeEditable" class="authing-tip">
                您的推广在审核中，审核通过后可修改落地页，感谢配合！
              </p>
            </div>
          </span>
        </div>
        <div>
          <aside>投放城市：</aside>
          <span>
            <el-tag type="success"
              :closable="!isFormReadonly"
              v-for="c in getProp('areas')" :key="c"
              @close="removeArea(c)">
              {{ formatterArea(c) }}
            </el-tag>
            <i v-if="!isFormReadonly" class="el-icon-plus"
              @click="areaDialogVisible = true">
            </i>
          </span>
        </div>
        <promotion-area-limit-tip :all-areas="allAreas"
          :selected-areas="getProp('areas')">
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
        :platform="getProp('source')"
        :title="getProp('creativeTitle')"
        :content="getProp('creativeContent')"
        :title-tip="creativeTitleTip"
        :isFormReadonly="isFormReadonly"
        :isCreativeEditable="isCreativeEditable"
        :refuseReason="originPromotion.refuseReason"
        :checkCreativeBtnDisabled="checkCreativeBtnDisabled"
        @change-title="v => promotion.creativeTitle = v"
        @change-content="v => promotion.creativeContent = v"
      />
      <section class="keyword">
        <header>选取推广关键词</header>
        <h4>
          <span>已经设置的关键词</span>
          <label>当前关键词数量: {{ currentKeywords.length }}个</label>
        </h4>
        <keyword-list
          mode="update"
          :platform="getProp('source')"
          :words="currentKeywords"
          :offset="currentKeywordsOffset"
          :selectable="false"
          :deletable="!isFormReadonly"
          :show-prop-show="false"
          :show-prop-status="true"
          :show-prop-ranking="true"
          :campaign-offline="isCampaignOffline"
          @update-word="updateExistWord"
          @change-offset="offset => currentKeywordsOffset = offset"
          @delete-word="word => promotion.deletedKeywords.push(word)"
        />
        <h3 v-if="!isFormReadonly">
          <label>关键词不够？</label>
          <a @click="switchWordsVisible">点此自定义添加</a>
        </h3>
        <div v-if="newaddedWordsVisible">
          <span>
            <el-input placeholder="请输入关键词"
              v-model.trim="queryWord" @keyup.native.enter="queryRecommendedWords" />
          </span>
          <el-button type="primary" @click="queryRecommendedWords">
            查询
          </el-button>
          <strong>
            （请优先添加较为核心的关键词，关键词长度不宜超过5个字，不区分大小写。）
          </strong>
        </div>
        <keyword-list
          v-if="newaddedWordsVisible"
          mode="select"
          :platform="getProp('source')"
          :words="addibleWords"
          :offset="addibleWordsOffset"
          :selected-words="promotion.newKeywords"
          :campaign-offline="isCampaignOffline"
          @update-word="updateNewWord"
          @change-offset="setAddibleWordsOffset"
          @select-words="words => promotion.newKeywords = [...words]"
        />
      </section>
      <section class="timing">
        <header>设置时长和预算</header>
        <div>
          <aside>投放时间:</aside>
          <span>
            <el-button-group>
              <el-button :type="timeType === 'long' ? 'primary' : ''"
                @click="setTimeType('long')">
                长期投放
              </el-button>
              <el-button :type="timeType === 'custom' ? 'primary' : ''"
                @click="setTimeType('custom')">
                定时投放
              </el-button>
            </el-button-group>
          </span>
          <span>
            <el-date-picker v-if="timeType === 'custom'"
              :disabled="isFormReadonly"
              type="daterange" placeholder="选择日期范围"
              :picker-options="{disabledDate}"
              :value="getProp('validTime')"
              @input="v => promotion.validTime = v">
            </el-date-picker>
          </span>
        </div>
        <div>
          <aside>设置推广日预算:</aside>
          <span>
            <el-input
              :disabled="isFormReadonly || !modifyBudgetQuota"
              type="number" placeholder="请输入每日最高预算"
              :value="getProp('dailyBudget')"
              @change="v => promotion.dailyBudget = v">
            </el-input>
          </span>
          <i>元</i>
          <span>
            （根据您选取的关键词，最低预算为<p>{{ predictedInfo.dailyBudget }}</p>元，
            今日还可修改<p>{{ modifyBudgetQuota }}</p>次）
          </span>
        </div>
        <h3>
          {{ `您的推广资金余额：￥${ centToYuan(currentBalance) } 元，可消耗` }}
          <strong>{{ predictedInfo.duration }}</strong>天
        </h3>
        <contract-ack type="content-rule"></contract-ack>
        <div>
          <el-button v-if="false" type="primary">
            先去充值
          </el-button>
          <el-button type="primary"
            :disabled="isUpdating || isFormReadonly"
            @click="updatePromotion">
            更新推广
          </el-button>
        </div>
        <promotion-charge-tip />
      </section>
    </main>
    <area-selector :all-areas="allAreas"
      :areas="getProp('areas')" type="qwt"
      :visible="areaDialogVisible"
      :enable-china="false"
      @ok="onChangeAreas"
      @cancel="areaDialogVisible = false">
    </area-selector>
    <duration-selector
      :visible="durationSelectorVisible"
      :platform="getProp('source')"
      :schedule="getCurrentSchedule()"
      @change="onChangeDuration"
      @hide="durationSelectorVisible = false">
    </duration-selector>
  </div>
</template>

<script>
import VueScrollTo from 'vue-scrollto'
import { Message } from 'element-ui'
import isEqual from 'lodash.isequal'
import uuid from 'uuid/v4'

import PromotionAreaLimitTip from 'com/widget/promotion-area-limit-tip'
import QiqiaobanPageSelector from 'com/common/qiqiaoban-page-selector'
import PromotionChargeTip from 'com/widget/promotion-charge-tip'
import PromotionRuleLink from 'com/widget/promotion-rule-link'
import DurationSelector from 'com/common/duration-selector'
import UserAdSelector from 'com/common/user-ad-selector'
import CreativeEditor from 'com/widget/creative-editor'
import KeywordList from 'com/common/qwt-keyword-list'
import AreaSelector from 'com/common/area-selector'
import ContractAck from 'com/widget/contract-ack'
import Topbar from 'com/topbar'

import { disabledDate } from 'util/element'
import { isBaixingSales } from 'util/role'
import track from 'util/track'
import {
  isQwtEnableCity,
  fmtAreasInQwt,
  getCnName
} from 'util/meta'

import {
  checkCreativeContent,
  updateCampaign
} from 'api/fengming'

import {
  CREATIVE_STATUS_PENDING,
  CAMPAIGN_STATUS_OFFLINE,
  SEM_PLATFORM_SHENMA,
  SEM_PLATFORM_SOGOU,
  SEM_PLATFORM_BAIDU,
  SEM_PLATFORM_QIHU,

  landingTypeOpts
} from 'constant/fengming'

import {
  checkCampaignValidTime,
  getCampaignPrediction,
  getCampaignValidTime
} from 'util/campaign'

import {
  centToYuan
} from 'utils'

import store from './store'

const isArray = Array.isArray
const MIN_WORD_PRICE = 200

export default {
  name: 'qwt-update-promotion',
  components: {
    PromotionAreaLimitTip,
    QiqiaobanPageSelector,
    PromotionChargeTip,
    PromotionRuleLink,
    DurationSelector,
    CreativeEditor,
    UserAdSelector,
    AreaSelector,
    KeywordList,
    ContractAck,
    Topbar
  },
  fromMobx: {
    recommendedWords: () => store.recommendedWords,
    originPromotion: () => store.originPromotion,
    currentBalance: () => store.currentBalance,
    timeType: () => store.timeType
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
      actionTrackId: uuid(),
      landingTypeOpts,

      durationSelectorVisible: false,
      newaddedWordsVisible: false,
      areaDialogVisible: false,

      currentKeywordsOffset: 0,
      addibleWordsOffset: 0,
      isUpdating: false,
      queryWord: '',
      // 注: 此处逻辑比较容易出错, 此处 定义为 undefined 与 getXXXdata 处 密切相关
      // 注: 需要密切关注 更新 数据 的获取
      promotion: {
        // 创意
        landingType: undefined,
        landingPage: undefined,
        creativeTitle: undefined,
        creativeContent: undefined,
        // 活动
        areas: undefined,
        dailyBudget: undefined,
        validTime: undefined,
        // 关键词
        updatedKeywords: [],
        deletedKeywords: [],
        newKeywords: []
      },

      SEM_PLATFORM_SHENMA,
      SEM_PLATFORM_BAIDU,
      SEM_PLATFORM_SOGOU,
      SEM_PLATFORM_QIHU
    }
  },
  computed: {
    modifyBudgetQuota() {
      const n = this.getProp('budgetModificationCount') | 0
      let q = 5 - n
      if (q < 0) {
        q = 0
      }

      return q
    },
    isFormReadonly() {
      const { userInfo } = this
      return isBaixingSales(userInfo.roles)
    },
    currentKeywords() {
      const { keywords } = this.originPromotion

      const {
        updatedKeywords,
        deletedKeywords
      } = this.promotion

      return keywords
        .filter(w => !deletedKeywords.map(i => i.id).includes(w.id))
        .map(w => {
          for (const word of updatedKeywords) {
            if (word.id === w.id) {
              return {
                ...w,
                ...word
              }
            }
          }

          return {...w}
        })
    },
    addibleWords() {
      const words = this.currentKeywords.map(w => w.word.toLowerCase())

      return this.recommendedWords
        .filter(w => !words.includes(w.word.toLowerCase()))
    },
    predictedInfo() {
      const {
        currentBalance,
        promotion
      } = this

      const {
        keywords = [],
        newKeywords = []
      } = promotion

      const prices = [...keywords, ...newKeywords]
        .map(k => k.price)

      return getCampaignPrediction(currentBalance, prices)
    },
    checkCreativeBtnDisabled() {
      const data = this.getUpdatedCreativeData()

      if (data.creativeTitle || data.creativeContent) {
        return false
      }

      const { extra } = this.originPromotion
      const reason = extra.campaignDeletedReason || ''

      if (reason === '投放内容违规被下线') {
        return true
      } else {
        return false
      }
    },
    isCreativeEditable() {
      const source = this.getProp('source')

      // 说明: sougou 审核中, 不允许修改创意; 但 360 可以
      if ([
        SEM_PLATFORM_SHENMA,
        SEM_PLATFORM_BAIDU,
        SEM_PLATFORM_QIHU
      ].includes(source)) {
        return true
      }

      if (source === SEM_PLATFORM_SOGOU &&
        this.isCampaignOffline &&
        this.isCreativeAuthing) {
        return true
      }

      return !this.isCreativeAuthing
    },
    isCreativeAuthing() {
      const {
        auditStatus
      } = this.originPromotion

      return auditStatus === CREATIVE_STATUS_PENDING
    },
    isCampaignOffline() {
      const {
        status
      } = this.originPromotion

      return status === CAMPAIGN_STATUS_OFFLINE
    },
    creativeTitleTip() {
      if (this.isCampaignOffline) {
        return '您当前的计划已下线，请重新开启投放'
      }

      if (this.isCreativeAuthing) {
        return '您的推广物料正在审核中，预计审核时间3个工作日内，请您耐心等待。'
      }

      return ''
    },
    id() {
      return this.$route.params.id
    }
  },
  methods: {
    setAddibleWordsOffset(offset) {
      this.addibleWordsOffset = offset
    },
    setLandingPage(url) {
      this.promotion.landingPage = url
      this.promotion.areas = ['quanguo']
    },
    async onSelectAd(ad) {
      const { allAreas } = this

      this.promotion.category = ad.category
      if (isQwtEnableCity(ad.city, allAreas)) {
        this.promotion.areas = [ad.city]
      }
      this.promotion.landingPageId = ad.adId
      this.promotion.landingPage = ad.url
    },
    getCurrentSchedule() {
      const schedule = this.getProp('schedule')

      return Array.isArray(schedule)
        ? schedule.join(',')
        : schedule
    },
    getDurationType() {
      const schedule = this.getProp('schedule')

      if (!schedule) {
        return '全时段'
      }

      const sum = schedule.reduce((a, b) => a + b, 0)
      const source = this.getProp('source')

      if (source === SEM_PLATFORM_SOGOU) {
        return sum < 3670009 ? '部分时段' : '全时段'
      }

      return sum < 117440505 ? '部分时段' : '全时段'
    },
    onChangeDuration(durations) {
      this.promotion.schedule = durations
    },
    getProp(prop) {
      if (typeof this.promotion[prop] !== 'undefined') {
        return this.promotion[prop]
      }

      return this.originPromotion[prop]
    },
    async initCampaignInfo() {
      await Promise.all([
        store.getCampaignInfo(this.id),
        store.getCurrentBalance()
      ])
    },
    clickSourceTip() {
      Message.warning('投放渠道不能修改')
    },
    clickLandingType(type) {
      if (!this.isCreativeEditable) {
        return Message.warning('审核中, 无法修改')
      }

      if (this.getProp('landingType') === type) {
        return
      }

      this.promotion.landingType = type

      if ([1, 4].includes(type)) {
        this.promotion.landingPage = undefined
      }
    },
    updateExistWord(word) {
      const words = this.promotion.updatedKeywords.map(w => w.word)

      if (words.includes(word.word)) {
        this.promotion.updatedKeywords = this.promotion.updatedKeywords.map(w => {
          if (w.word === word.word) {
            return {
              ...w,
              price: word.price
            }
          } else {
            return {...w}
          }
        })
      } else {
        this.promotion.updatedKeywords.push({
          ...word
        })
      }
    },
    updateNewWord(word) {
      this.promotion.newKeywords = this.promotion.newKeywords.map(w => {
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
    getUpdatedCreativeData() {
      const {
        creativeContent: originCreativeContent,
        creativeTitle: originCreativeTitle,
        landingPage: originLandingPage
      } = this.originPromotion
      // 说明: 如下四个值, 分为2组, 每一组要么都不传(to server), 要么都传(to server)
      const {
        creativeContent,
        creativeTitle,

        landingPage
      } = this.promotion

      const changed = (now, ori) => {
        if (now === undefined) {
          return false
        }

        return now !== ori
      }

      if (creativeContent === '') {
        throw new Error('请填写推广内容')
      }

      if (creativeTitle === '') {
        throw new Error('请填写推广标题')
      }

      if (landingPage === '') {
        throw new Error('请填写投放页面')
      }

      const result = {}

      if (changed(creativeContent, originCreativeContent) ||
        changed(creativeTitle, originCreativeTitle)) {
        result.creativeContent = this.getProp('creativeContent')
        result.creativeTitle = this.getProp('creativeTitle')
      }

      if (changed(landingPage, originLandingPage)) {
        // 忽略如下情形: 改了 type, 不改 page
        //   - changed(landingType, originLandingType)
        result.landingType = this.getProp('landingType')
        result.landingPage = this.getProp('landingPage')
      }

      return result
    },
    getUpdatedValidTime() {
      const {
        timeRange: originTimeRange, // 说明: 参见 store 的处理
        validTime: originValidTime // validTime 为格式化的 timeRange
      } = this.originPromotion
      const { validTime } = this.promotion

      let newValidTime

      if (this.timeType === 'long') {
        newValidTime = [null, null]
      } else {
        if (validTime) {
          if (checkCampaignValidTime(validTime) === 'custom') {
            newValidTime = getCampaignValidTime(validTime)
          } else {
            // 比如: clear daterange -> undefined || [null, null]
            throw new Error('请填写投放日期或选择长期投放')
          }
        } else {
          // 比如: sb user 点击自定义投放 却 不选时间
          if (checkCampaignValidTime(originValidTime) === 'custom') {
            // ignore
          } else {
            throw new Error('请填写投放日期或选择长期投放')
          }
        }
      }

      // 检测是否变更
      if (!isEqual(originTimeRange, newValidTime)) {
        return newValidTime
      }
      // no change, no return
    },
    getUpdatedPromotionData() {
      // dailyBudget areas 要么都传, 要么都不传
      const {
        dailyBudget,
        schedule,
        areas
      } = this.promotion

      const data = {}
      if (schedule) {
        data.schedule = schedule
      }

      const pp = this.predictedInfo.dailyBudget
      if ((dailyBudget !== undefined)) {
        if (dailyBudget < pp) {
          throw new Error(`推广日预算需大于 ${pp} 元`)
        }

        if (dailyBudget > 10000000) {
          throw Message.error('推广日预算太高啦！您咋这么土豪呢~')
        }
      }

      if (areas && areas.length === 0) {
        throw new Error('请选择投放区域')
      }

      if (dailyBudget || (areas && areas.length)) {
        data.dailyBudget = this.getProp('dailyBudget') * 100 | 0
        data.areas = isArray(areas) ? [...areas] : this.originPromotion.areas
      }

      const newValidTime = this.getUpdatedValidTime()
      if (newValidTime) {
        data.validTime = newValidTime
      }

      return data
    },
    getUpdatedKeywordsData() {
      const {
        updatedKeywords,
        deletedKeywords,
        newKeywords
      } = this.promotion

      const data = {}

      if (updatedKeywords.length) {
        data.updatedKeywords = [...updatedKeywords]
      }

      if (deletedKeywords.length) {
        data.deletedKeywords = [...deletedKeywords]
      }

      if (newKeywords.length) {
        data.newKeywords = [...newKeywords]
      }

      return data
    },
    async updatePromotion() {
      if (this.isUpdating) {
        return Message.warning('正在更新中, 请稍等一会儿 ~')
      }

      this.isUpdating = true

      const { actionTrackId, userInfo, id } = this

      track({
        roles: userInfo.roles.map(r => r.name).join(','),
        action: 'click-button: update-campaign',
        baixingId: userInfo.baixingId,
        time: Date.now() / 1000 | 0,
        baxId: userInfo.id,
        campaignId: id,
        actionTrackId
      })

      try {
        await this._updatePromotion()
      } finally {
        this.isUpdating = false
      }
    },
    async _updatePromotion() {
      const { allAreas } = this

      let data = {}
      try {
        data = {
          ...this.getUpdatedCreativeData(),
          ...this.getUpdatedPromotionData(),
          ...this.getUpdatedKeywordsData()
        }
      } catch (err) {
        Message.error(err.message)
        return
      }

      if (this.isCampaignOffline) {
        if (this.checkCreativeBtnDisabled) {
          Message.error('您当前的投放内容违规，请修改后再投放，如有问题请联系客服或销售')
          return
        }
      }

      // check price
      const {
        updatedKeywords = [],
        newKeywords = [],

        creativeContent,
        creativeTitle
      } = data

      const words = [...updatedKeywords, ...newKeywords]

      for (const w of words) {
        // if (w.price * 2 < w.originPrice) {
        //   return Message.error(`关键字: ${w.word} 出价低于 ${(w.originPrice / 200).toFixed(2)}, 请调高出价`)
        // }
        if (w.price < MIN_WORD_PRICE) {
          return Message.error(`关键字: ${w.word} 出价不得低于 ${MIN_WORD_PRICE}元, 请调高出价`)
        }
      }

      if (creativeContent && creativeTitle) {
        // 变更时检测
        const platform = this.getProp('source')
        const res = await checkCreativeContent({
          creativeContent,
          creativeTitle,
          platform
        })

        if (res.result) {
          return Message.error(res.hint)
        }
      }

      await updateCampaign(this.id, fmtAreasInQwt(data, allAreas))

      Message.success('更新成功')

      await store.clearStore()

      this.$router.push({
        name: 'qwt-promotion-list'
      })
    },
    async queryRecommendedWords() {
      const { queryWord } = this

      if (!queryWord) {
        return Message.error('请输入查询关键词')
      }

      const preLength = this.addibleWords.length
      await store.getRecommendedWords(queryWord, this.getProp('areas'))
      this.addibleWordsOffset = preLength
    },
    async checkCreativeContent() {
      const creativeContent = this.getProp('creativeContent')
      const creativeTitle = this.getProp('creativeTitle')
      const platform = this.getProp('source')

      if (!creativeContent) {
        return Message.error('请填写推广内容')
      }

      if (!creativeTitle) {
        return Message.error('请填写推广标题')
      }

      const data = await checkCreativeContent({
        creativeContent,
        creativeTitle,
        platform
      })

      if (!data.result) {
        Message.success(data.hint)
      } else {
        Message.error(data.hint)
      }
    },
    gotoReportPage() {
      const { id } = this

      this.$router.push({
        name: 'qwt-dashboard',
        query: {
          source: 'qwt-update-promotion',
          campaignId: id
        }
      })
    },
    switchWordsVisible() {
      this.newaddedWordsVisible = !this.newaddedWordsVisible
    },
    onChangeAreas(areas) {
      this.promotion.areas = [...areas]
      this.areaDialogVisible = false
    },
    formatterArea(name) {
      const { allAreas } = this
      return getCnName(name, allAreas)
    },
    removeArea(c) {
      this.promotion.areas = [
        ...this.getProp('areas').filter(i => i !== c)
      ]
    },
    setTimeType(type) {
      store.setTimeType(type)
    },
    disabledDate,
    centToYuan
  },
  watch: {
    '$route.params.id': async function(v, p) {
      if (v !== p) {
        await this.initCampaignInfo()
      }
    }
  },
  async beforeDestroy() {
    console.debug('will destroy')
    await store.clearStore()
  },
  async mounted() {
    await this.initCampaignInfo()

    setTimeout(() => {
      if (this.$route.query.target === 'keyword') {
        VueScrollTo.scrollTo('.keyword', 100)
      }
    }, 320)

    setTimeout(() => {
      const { actionTrackId, userInfo, id } = this

      track({
        roles: userInfo.roles.map(r => r.name).join(','),
        action: 'enter-page: update-campaign',
        baixingId: userInfo.baixingId,
        time: Date.now() / 1000 | 0,
        baxId: userInfo.id,
        campaignId: id,
        actionTrackId
      })
    }, 1200)
  }
}
</script>

<style scoped>
@import 'cssbase/mixin';

.authing-tip {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  color: #ff4401;
}

.report-link {
  margin-left: 10px;
  background-color: unset;
  color: #20a0ff;
}

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

.qwt-update-promotion {
  padding: 0 35px;
  width: 100%;

  & > main {
    & > h3 {
      margin: 5px 0 15px;
      font-size: 18px;
      font-weight: normal;
      color: #1f2d3d;
    }

    & > section:not(:last-child) {
      border-bottom: 1px solid #c0ccda;
    }

    & > section {
      margin-bottom: 30px;
      padding-bottom: 30px;

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

        & > label {
          margin-left: 10px;
          font-size: 12px;
          color: red;
        }
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

      & > div:nth-child(5) {
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
          width: 480px;
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
</style>
