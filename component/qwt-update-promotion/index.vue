<template>
  <div class="qwt-update-promotion">
    <main>
      <h3>推广计划: {{ id }}</h3>
      <section>
        <header>推广目标设置</header>
        <div>
          <aside style="align-items: flex-start; padding-top: 5px;">
            投放页面：
          </aside>
          <span class="landingpage" v-if="!isErrorLandingPageShow">
            <div>
              <el-button-group>
                <el-button v-for="o of landingTypeOpts" :key="o.value"
                  :type="getProp('landingType') === o.value ? 'primary' : ''"
                  @click="clickLandingType(o.value)">
                  {{ o.label }}
                </el-button>
              </el-button-group>
              <a href="javascript:;" class="qiqiaoban-warning" v-if="isQiqiaobanSite" @click="goChargeKaSite">升级新精品官网，全网通替你付一半</a>
            </div>
            <div style="margin-top: 20px;">
              <user-ad-selector
                v-if="getProp('landingType') === 0"
                :type="adSelectortype"
                :disabled="disabled"
                :all-areas="allAreas" :limit-mvp="false"
                :selected-id="getProp('landingPageId')"
                @select-ad="ad => onSelectAd(ad)">
              </user-ad-selector>

              <qiqiaoban-page-selector
                v-if="getProp('landingType') === 1"
                :disabled="disabled"
                :value="getProp('landingPage')"
                :is-qiqiaoban-site="isQiqiaobanSite"
                @change="setLandingPage">
              </qiqiaoban-page-selector>

              <p v-if="disabled" class="authing-tip">
                您的推广在审核中，审核通过后可修改落地页，感谢配合！
              </p>
            </div>
          </span>
          <div class="page-error-placeholder" v-else>
            所选推广页面失效，请 <a href="javascript:;" @click="isErrorLandingPageShow = false; adSelectortype = ''">从新选择</a>
          </div>
        </div>
        <div>
          <aside>投放城市：</aside>
          <span>
            <el-tag type="danger"
              :closable="!isSales"
              v-for="c in getProp('areas')" :key="c"
              @close="removeArea(c)">
              {{ formatterArea(c) }}
            </el-tag>
            <i v-if="!isSales" class="el-icon-plus"
              @click="areaDialogVisible = true">
            </i>
          </span>
        </div>
        <promotion-area-limit-tip :all-areas="allAreas"
          :selected-areas="getProp('areas')">
        </promotion-area-limit-tip>
      </section>
      <section class="creative">
        <header class="top-col">
          <promotion-creative-tip :highlight="canOptimize('creative')"/>
          <el-button type="primary" class="button" size="small" @click="optimizeCreative">一键优化</el-button>
        </header>
        <creative-editor
          :update-promotion="true"
          :platforms="[getProp('source')]"
          :title="getProp('creativeTitle')"
          :content="getProp('creativeContent')"
          :disabled="disabled"
          :creative-status="originPromotion.auditStatus"
          :status-text="originPromotion.detailStatusText"
          :campaign-offline="isCampaignOffline"
          @change="handleCreativeValueChange"
          @error="handleCreativeError"
        />
      </section>
      <section class="keyword">
        <header class="top-col">
          <span :class="canOptimize('keyword')">选取推广关键词</span>
          <el-input size="small" class="input" placeholder="添加关键词" v-model="queryWord"/>
          <el-button size="small" type="warning" class="button" @click="addKeyword('single')">添加</el-button>
          <el-button size="small" type="primary" class="button" @click="addKeyword">一键拓词</el-button>
          <strong>当前关键词数量: {{ currentKeywords.length }}个</strong>
        </header>
        <keyword-list
          mode="update"
          :platform="getProp('source')"
          :words="currentKeywords"
          :offset="currentKeywordsOffset"
          :selectable="false"
          :deletable="!isSales"
          :show-prop-show="false"
          :show-prop-status="true"
          :show-prop-ranking="true"
          :campaign-offline="isCampaignOffline"
          :campaign-online="isCampaignOnline"
          @update-word="updateExistWord"
          @change-offset="offset => currentKeywordsOffset = offset"
          @delete-word="handleDeleteWord"
        />
      </section>
      <section class="timing">
        <header>设置时长和预算</header>
        <div>
          <aside>投放渠道&nbsp;
            <el-tooltip placement="top" content="行业投放规则">
            <a href="/qa?promotion-rules" style="color: #6a778c;">
              <i class="el-icon-question"></i>
            </a>
            </el-tooltip>：
          </aside>
          <span>
            <el-checkbox-group :value="[getProp('source')]" disabled>
              <el-checkbox
                @click.native="clickSourceTip"
                v-for="sourceTip in Object.entries(sourceTipMap)"
                :key="sourceTip[0]"
                :label="+sourceTip[0]"
                >
                {{sourceTip[1]}}
              </el-checkbox>
            </el-checkbox-group>
          </span>
          <!-- <promotion-rule-link /> -->
        </div>
        <div>
          <aside>设置推广日预算:</aside>
          <span>
            <el-input
              size="small"
              :disabled="isSales || !modifyBudgetQuota"
              type="number" placeholder="请输入每日最高预算"
              :value="getProp('dailyBudget')"
              @input="v => promotion.dailyBudget = Number(v)">
            </el-input>
          </span>
          <i>元</i>
          <span class="prompt-text">
            （根据您选取的关键词，建议最低预算为<strong>{{ f2y(predictedInfo.minDailyBudget) }}</strong>元，
            今日还可修改<strong>{{ modifyBudgetQuota }}</strong>次）
          </span>
        </div>
        <h3 v-if="usableBalance <= 0" class="prompt-text">
          <!-- 扣除其余有效计划日预算后， -->
          您的推广资金可用余额为0元，请<router-link :to="{name: 'qwt-charge', query: {mode: 'charge-only'}}">充值</router-link>
        </h3>
        <h3 v-else class="prompt-text">
          <!-- 扣除其余有效计划日预算后， -->
          您的推广资金可用余额为￥{{f2y(usableBalance)}}元，可消耗<strong>{{predictedInfo.days}}</strong>天
        </h3>

        <el-button
          type="primary"
          :style="{marginTop: '20px'}"
          :icon="moreSettingDisplay ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
          @click="toggleDisplaySettingArea"
          >
          更多设置
        </el-button>
        <section v-show="moreSettingDisplay" class="more-setting-container">
          <section class="promotion-time">
            <div>
              <aside :class="canOptimize('duration')">投放时段：</aside>
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
            <div>
              <aside :class="canOptimize('time')">投放时间:</aside>
              <span>
                <el-button-group>
                  <el-button :type="timeType === 'long' ? 'primary' : ''"
                    size="small"
                    @click="setTimeType('long')">
                    长期投放
                  </el-button>
                  <el-button :type="timeType === 'custom' ? 'primary' : ''"
                    size="small"
                    @click="setTimeType('custom')">
                    定时投放
                  </el-button>
                </el-button-group>
              </span>
              <span>
                <el-date-picker v-if="timeType === 'custom'"
                  size="small"
                  :disabled="isSales"
                  type="daterange" placeholder="选择日期范围"
                  :picker-options="{disabledDate}"
                  :value="getProp('validTime')"
                  @input="v => promotion.validTime = v">
                </el-date-picker>
              </span>
            </div>
          </section>
          <section class="mobile-ratio" v-if="getProp('source') !== SEM_PLATFORM_SHENMA">
            <section>
              <label :class="canOptimize('ratio')">
                选择投放移动端的出价比例：
              </label>
              <section>
                <span>
                  <el-input
                    size="small"
                    :value="getProp('mobilePriceRatio')"
                    @input="v => promotion.mobilePriceRatio = v"
                    placeholder="默认为1"
                  />
                </span>
                <span class="prompt-text">
                  (请输入 0.1-9.9 之间的数字)
                </span>
              </section>
            </section>
            <promotion-mobile-ratio-tip />
          </section>
        </section>

        <contract-ack type="content-rule"></contract-ack>
        <div>
          <el-button v-if="false" type="primary">
            先去充值
          </el-button>
          <el-button type="primary"
            :disabled="isUpdating || isSales"
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

import PromotionMobileRatioTip from 'com/widget/promotion-mobile-ratio-tip'
import PromotionAreaLimitTip from 'com/widget/promotion-area-limit-tip'
import QiqiaobanPageSelector from 'com/common/qiqiaoban-page-selector'
import PromotionCreativeTip from 'com/widget//promotion-creative-tip'
import PromotionChargeTip from 'com/widget/promotion-charge-tip'
import PromotionRuleLink from 'com/widget/promotion-rule-link'
import DurationSelector from 'com/common/duration-selector'
import UserAdSelector from 'com/common/user-ad-selector'
import CreativeEditor from 'com/widget/creative-editor'
import KeywordList from 'com/common/qwt-keyword-list'
import AreaSelector from 'com/common/area-selector'
import ContractAck from 'com/widget/contract-ack'

import { disabledDate } from 'util/element'
import { isBaixingSales } from 'util/role'
import track from 'util/track'
import {
  isQwtEnableCity,
  fmtAreasInQwt,
  getCnName
} from 'util/meta'

import {
  recommendByUrl,
  updateCampaign,
  recommendByWord,
  getQiqiaobanCoupon,
  checkCreativeContent,
  getRecommandCreative,
  changeCampaignKeywordsPrice
} from 'api/fengming'

import {
  CREATIVE_STATUS_REJECT,
  CREATIVE_STATUS_PENDING,
  CAMPAIGN_STATUS_OFFLINE,
  CAMPAIGN_STATUS_ONLINE,
  SEM_PLATFORM_SHENMA,
  SEM_PLATFORM_SOGOU,
  SEM_PLATFORM_BAIDU,
  SEM_PLATFORM_QIHU,

  landingTypeOpts
} from 'constant/fengming'

import {
  keywordPriceTip
} from 'constant/tip'

import {
  MIN_WORD_PRICE,
  MAX_WORD_PRICE
} from 'constant/keyword'

import {
  checkCampaignValidTime,
  getCampaignPrediction,
  getCampaignValidTime
} from 'util/campaign'

import {
  f2y,
  isQiqiaobanSite,
  isSiteLandingType
} from 'util/kit'

import store from './store'

const isArray = Array.isArray

const MIN_DAILY_BUDGET = 100 * 100

const sourceTipMap = {
  [SEM_PLATFORM_BAIDU]: '百度',
  [SEM_PLATFORM_SOGOU]: '搜狗',
  [SEM_PLATFORM_QIHU]: '360',
  [SEM_PLATFORM_SHENMA]: '神马'
}

export default {
  name: 'qwt-update-promotion',
  components: {
    PromotionMobileRatioTip,
    PromotionAreaLimitTip,
    QiqiaobanPageSelector,
    PromotionCreativeTip,
    PromotionChargeTip,
    PromotionRuleLink,
    DurationSelector,
    CreativeEditor,
    UserAdSelector,
    AreaSelector,
    KeywordList,
    ContractAck
  },
  fromMobx: {
    recommendedWords: () => store.recommendedWords,
    originPromotion: () => store.originPromotion,
    currentBalance: () => store.currentBalance,
    timeType: () => store.timeType,
    usableBalance: () => store.usableBalance
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
      creativeError: null,
      sourceTipMap, // 投放渠道

      actionTrackId: uuid(),
      landingTypeOpts,
      durationSelectorVisible: false,
      areaDialogVisible: false,

      currentKeywordsOffset: 0,

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
        newKeywords: [],

      },

      moreSettingDisplay: false,
      // 是否为老官网
      isQiqiaobanSite: false,
      adSelectortype: 'reselect',
      isErrorLandingPageShow: false,

      SEM_PLATFORM_SHENMA,
      SEM_PLATFORM_BAIDU,
      SEM_PLATFORM_SOGOU,
      SEM_PLATFORM_QIHU
    }
  },
  computed: {
    // displayBlance() {
    //   // 充足情况下余额显示为真实余额+计划日消耗，不充足情况直接现实真是余额
    //   if (this.usableBalance > this.getProp('dailyBudget') * 100) {
    //     return this.usableBalance + this.getProp('dailyBudget') * 100
    //   } else {
    //     return this.usableBalance
    //   }
    // },
    modifyBudgetQuota() {
      const n = this.getProp('budgetModificationCount') | 0
      let q = 5 - n
      if (q < 0) {
        q = 0
      }

      return q
    },
    isSales() {
      return isBaixingSales(this.userInfo.roles)
    },
    disabled() {
      const source = this.getProp('source') // 渠道
      const creativeAuditing = this.creativeAuditing // 审核中

      // 审核中：神马，百度，360落地页和创意应该可以修改；搜狗无法修改
      if(source === SEM_PLATFORM_SOGOU && creativeAuditing) {
        return true
      }
      return false
    },
    currentKeywords() {
      const { keywords: originKeywords } = this.originPromotion
      const {
        updatedKeywords,
        deletedKeywords,
        newKeywords
      } = this.promotion
      // 新增的keywords 加上原来的keywords
      const keywords = newKeywords.map(word => ({
        isNew: true,
        ...word
      })).concat(originKeywords)
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
    creativeAuditing() {
      return this.originPromotion.auditStatus === CREATIVE_STATUS_PENDING
    },
    isCampaignOffline() {
      const {
        status
      } = this.originPromotion

      return status === CAMPAIGN_STATUS_OFFLINE
    },
    isCampaignOnline() {
      const { status } = this.originPromotion
      return status === CAMPAIGN_STATUS_ONLINE
    },
    id() {
      return this.$route.params.id
    },
    predictedInfo() {
      const v = this.getProp('dailyBudget')
      if (!v) {
        return {
          minDailyBudget: MIN_DAILY_BUDGET,
          days: 0
        }
      }
      const {
        usableBalance,
        promotion
      } = this

      const {
        keywords = [],
        newKeywords = [],
        updatedKeywords = []
      } = promotion

      const prices = [...keywords, ...newKeywords, ...updatedKeywords]
        .map(k => k.price)

      // 与创建时不同，这里需要加上计划原本设置的每日预算
      return getCampaignPrediction(usableBalance, v * 100, prices)
    }
  },
  methods: {
    handleCreativeValueChange({title, content}) {
      this.promotion.creativeTitle = title
      this.promotion.creativeContent = content
    },
    async goChargeKaSite() {
      await getQiqiaobanCoupon(this.id)
      this.$router.push('/main/qwt/charge?select_gw=1')
    },
    handleCreativeError(message) {
      if(message) Message.error(message)
      this.creativeError = message
    }, 
    toggleDisplaySettingArea() {
      this.moreSettingDisplay = !this.moreSettingDisplay
    },
    setLandingPage() {
      this.promotion.landingPage = url
      this.promotion.areas = ['quanguo']
    },
    banLandPageSelected() {
      // 落地页404，需要更改落地页投放
      if (this.isErrorLandingPageShow && (!this.promotion.landingPage || this.promotion.landingPage === this.originPromotion.landingPage)) {
        this.adSelectortype = ''
        const pageErrorPlaceholder = document.querySelector('.page-error-placeholder')
        pageErrorPlaceholder.scrollIntoViewIfNeeded()
        pageErrorPlaceholder.style.borderColor = "#ff4401"
        throw this.$message.error('当前投放页面失效，请重新选择新的投放页面')
      }
      // 已经下线计划当前落地页为老官网且 没有重选新落地页
      if(this.isQiqiaobanSite && this.isCampaignOffline && (!this.promotion.landingPage || isQiqiaobanSite(this.promotion.landingPage))) {
        this.adSelectortype = ''
        const landingpage = document.querySelector('.landingpage')
        landingpage.scrollIntoViewIfNeeded()
        throw this.$message.error('请修改推广计划的投放页面')
      }
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
        store.getCurrentBalance(),
        store.getUsableBalance()
      ])
    },
    clickSourceTip() {
      Message.warning('投放渠道不能修改')
    },
    clickLandingType(type) {
      if (this.disabled) {
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
      const {
        newKeywords,
        updatedKeywords
      } = this.promotion
      // 更新的关键词是新增加的关键词
      if (newKeywords.some(w => word.word === w.word)) {
        this.promotion.newKeywords = newKeywords.map(w => {
          if (word.word === w.word) {
            return {
              ...w,
              ...word
            }
          } else {
            return {...w}
          }
        })
      } else {
        // 更新的关键词是已经存在的
        const words = updatedKeywords.map(w => w.word)
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
      }
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

      // FIX: 修复 landingPage landingType 错误
      if (landingPage) {
        result.landingType = isSiteLandingType(landingPage) ? 1 : 0
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
      const {
        dailyBudget, // 元
        schedule,
        areas
      } = this.promotion

      const data = {}
      if (schedule) {
        data.schedule = schedule
      }

      if ((dailyBudget !== undefined)) {
        if (dailyBudget * 100 < MIN_DAILY_BUDGET) {
          throw new Error(`推广日预算需大于 ${f2y(MIN_DAILY_BUDGET)} 元`)
        }

        if (dailyBudget > 10000000) {
          throw Message.error('推广日预算太高啦！您咋这么土豪呢~')
        }
      }

      if (areas && areas.length === 0) {
        throw new Error('请选择投放区域')
      }

      // dailyBudget areas 要么都传, 要么都不传
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
      this.banLandPageSelected()
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
        actionTrackId,
        selectedSearchRecommends: this.promotion.newKeywords.length,
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
          ...this.getUpdatedKeywordsData(),
          mobilePriceRatio: this.promotion.mobilePriceRatio
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
        creativeTitle,
        mobilePriceRatio
      } = data


      const words = [...updatedKeywords, ...newKeywords]

      for (const w of words) {
        // if (w.price * 2 < w.originPrice) {
        //   return Message.error(`关键字: ${w.word} 出价低于 ${(w.originPrice / 200).toFixed(2)}, 请调高出价`)
        // }
        if (w.price < MIN_WORD_PRICE || w.price > MAX_WORD_PRICE) {
          return Message.error(keywordPriceTip)
        }
      }

      if (creativeContent && creativeTitle) {
        // 变更时检测
        const platforms = [this.getProp('source')]
        const res = await checkCreativeContent({
          creativeContent,
          creativeTitle,
          platforms
        })

        if (res.result) {
          return Message.error(res.hint)
        }
      }

      if(mobilePriceRatio !== undefined) {
        const ratio = +(Number(mobilePriceRatio).toFixed(2))
        if(!(ratio >= 0.1 && ratio <= 9.9)) {
          return Message.error('投放移动端的出价比率应在0.1 ~ 9.9之间')
        }
      }
      console.log(this.promotion.landingPage)
      return

      await updateCampaign(this.id, fmtAreasInQwt(data, allAreas))

      Message.success('更新成功')

      await store.clearStore()

      this.$router.push({
        name: 'qwt-promotion-list'
      })
    },
    async checkCreativeContent() {
      const creativeContent = this.getProp('creativeContent')
      const creativeTitle = this.getProp('creativeTitle')
      const platform = this.getProp('source')

      if (this.creativeError) {
        return Message.error(this.creativeError)
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
    canOptimize(type) {
      const expandMoreSettingArea = () => this.moreSettingDisplay = true
      const opt = {
        creative: () => this.originPromotion.ctrMark,
        keyword: () => this.originPromotion.kwMark || this.originPromotion.priceMark,
        time: () => this.timeType === 'custom' && expandMoreSettingArea(),
        duration: () => this.getDurationType() === '部分时段' && expandMoreSettingArea(),
        ratio:
          () =>!(!this.getProp('mobilePriceRatio') || this.getProp('mobilePriceRatio') === 1 || +this.promotion.mobilePriceRatio === 1)
          && expandMoreSettingArea()
      }
      return opt[type]() ? 'highlight' : ''
    },
    async optimizeCreative() {
      const campaignId = this.$route.params.id
      const { title, content } = await getRecommandCreative({campaignId})
      if (!(title && content)) return this.$message.error('无法提供创意优化建议')
      this.promotion.creativeTitle = title
      this.promotion.creativeContent = content
    },
    filterExistCurrentWords(newWords) {
      const words = this.currentKeywords.map(w => w.word.toLowerCase())
      return newWords
        .filter(w => !words.includes(w.word.toLowerCase()))
    },
    async addKeyword(type) {
      const queryWord = this.queryWord.trim()
      let newKeywords = []
      if (type === 'single') {
        // 单个添加
        if (!queryWord) return
        const recommendKeywords = await recommendByWord(queryWord)
        const newKeyword = store.fmtNewKeywordsPrice(recommendKeywords).find( k => k.word === queryWord)
        console.log('单个关键词添加', newKeyword)
        if (!newKeyword) return this.$message.info('没有合适的关键词')
        newKeywords = [newKeyword]
        if (!this.filterExistCurrentWords(newKeywords).length) return this.$message.info('当前关键词已存在关键词列表')
        this.queryWord = ''
      } else {
        // 一键拓词
        const landingPage = this.promotion.landingPage || this.getProp('landingPage')
        const areas = this.promotion.areas || this.getProp('areas')
        const campaignId = +this.$route.params.id

        const recommendKeywords = await recommendByUrl(landingPage, areas, campaignId)
        if (!recommendKeywords.length) return this.$message.info('无法提供推荐关键词')
        newKeywords = this.filterExistCurrentWords(store.fmtNewKeywordsPrice(recommendKeywords)).slice(0, 5)
        if (!newKeywords.length) return this.$message.info('没有更多的关键词可以推荐啦')
      }
      this.promotion.newKeywords = newKeywords.concat(this.promotion.newKeywords)
    },
    handleDeleteWord(w) {
      const {isNew, ...word} = w
      if (!!isNew) {
        this.promotion.newKeywords = this.promotion.newKeywords.filter(w => w.word !== word.word)
      } else {
        this.promotion.deletedKeywords.push(word)
      }
    },
    async changeKeywordsPrice(keywordsPrice) {
      const price = keywordsPrice * 100
      const campaignId = +this.$route.params.id
      if (price < 200 || price > 99900) {
        throw '关键词有效出价区间为[2, 999]元，请调整出价'
      }
      await changeCampaignKeywordsPrice(campaignId, price)
      this.originPromotion.keywords.forEach(word => {
        this.updateExistWord({
          ...word,
          price
        })
      })
      this.promotion.newKeywords = this.promotion.newKeywords.map(word => ({
        ...word,
        price
      }))
      return '关键词批量改价成功'
    },
    disabledDate,
    f2y
  },
  watch: {
    'originPromotion'({landingPage, landingType}) {
      if (landingType === 1) {
        this.isQiqiaobanSite = isQiqiaobanSite(landingPage)
      }
    },
    '$route.params.id': async function(v, p) {
      if (v !== p) {
        await this.initCampaignInfo()
      }
    },
    'promotion.deletedKeywords'(deletedKws) {
      // 删除的时候有可能批量改价过，所以要把在deletedKeywords中的关键字从updatedKeywords中过滤
      this.promotion.updatedKeywords =
        this.promotion.updatedKeywords.filter(w => !deletedKws.some(dw => dw.word === w.word))
    }
  },
  async beforeDestroy() {
    await store.clearStore()
  },
  async mounted() {
    await this.initCampaignInfo()

    // 验证官网落地页是否404
    const { landingPage, landingType } = this.originPromotion
    if (landingType === 1) {
      const { status } = await fetch(landingPage, {
        method: 'head'
      })
      if (status === 404) {
        this.isErrorLandingPageShow = true
      }
    }
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

<style lang="postcss" scoped>
@import 'cssbase/mixin';

.qiqiaoban-warning {
  margin-left: 20px;
  font-size: 13px;
  color: #ff4401;
}

.page-error-placeholder {
  border: 1px solid #eee;
  border-radius: 4px;
  height: 161px;
  width: 540px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #999;
  & > a {
    color: #ff4401;
    margin-left: 5px;
  }
}

.authing-tip {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  color: #ff4401;
}

.creative {
  & .top-col {
    display: flex;
    align-items: center;
    & .button {
      margin-left: 32px;
      padding: 8px 25px;
    }
  }
}

.keyword {
  & .top-col {
    display: flex;
    align-items: center;
    & > strong {
      margin-left: 18px;
      color: #666;
      font-size: 12px;
    }
  }
  & .second-col {
    & .input {
      margin-left: 130px;
    }
  }
  & .input {
    width: 200px;
    margin-left: 32px;
    margin-right: 16px;
  }
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
  & .highlight {
    color: #B66969 !important;
    font-weight: 600;
  }
  & > main {
    & > h3 {
      background-color: #fff;
      font-size: 18px;
      font-weight: normal;
      color: #1f2d3d;
      padding: 20px;
      border-radius: 4px;
    }

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
        font-size: 14px;
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

      /* & > div:nth-child(2) {
        & > span:last-child {
          margin-left: 20px;
        }
      } */

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

          & > strong {
            color: red;
            margin: 0 5px;
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
          font-size: 16px;
        }
      }
    }
  }
}

.more-setting-container {
  margin-top: 30px;
  padding-top: 30px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-top: 1px solid #c0ccda;
  border-bottom: 1px solid #c0ccda;
  & > section {
    &.promotion-time {
      display: flex;
      align-items: center;
      & /deep/ .el-date-editor {
        position: relative;
        top: 2px;
      }
    }
    & > div {
      &:nth-child(2) {
        margin-left: 60px;
      }
      & > aside {
        color: #6a778c;
        font-size: 14px;
        margin-right: 16px;
      }
    }

    &.mobile-ratio {
      & > section {
        display: flex;
        align-items: center;
        margin-top: 30px;
        & > label {
          color: #6a778c;
          font-size: 14px;
          margin-right: 16px;
        }
        & .prompt-text {
          margin-left: 14px;
          color: #404e61;
        }
      }
    }
  }
}

.prompt-text {
  font-size: 12px !important;
}
</style>
