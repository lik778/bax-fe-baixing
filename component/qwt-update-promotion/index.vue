
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
              <el-button :type="getProp('source') === 0 ? 'primary' : ''"
                @click="clickSourceTip">
                百度
              </el-button>
              <el-button :type="getProp('source') === 5 ? 'primary' : ''"
                @click="clickSourceTip">
                搜狗
              </el-button>
              <el-button :type="getProp('source') === 1 ? 'primary' : ''"
                @click="clickSourceTip">
                360
              </el-button>
            </el-button-group>
          </span>
          <promotion-rule-link></promotion-rule-link>
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
              <el-input style="width: 560px;"
                v-if="![1, 4].includes(getProp('landingType'))"
                :disabled="!isCreativeEditable || isFormReadonly"
                :value="getProp('landingPage')"
                placeholder="输入投放网址，如：http://baixing.com 网址有误会影响投放效果，请检查后再投放"
                @change="v => promotion.landingPage = v.trim()">
              </el-input>

               <qiqiaoban-page-selector
                 v-if="getProp('landingType') === 1"
                 :disabled="!isCreativeEditable"
                 :value="getProp('landingPage')"
                 @change="v => promotion.landingPage = v">
              </qiqiaoban-page-selector>

              <cashcow-page-selector
                v-if="getProp('landingType') === 4"
                :disabled="!isCreativeEditable"
                :value="getProp('landingPage')"
                @change="v => promotion.landingPage = v">
              </cashcow-page-selector>
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
        <promotion-area-limit-tip :all-areas="allAreas">
        </promotion-area-limit-tip>
        <div>
          <aside>投放时段</aside>
          <span>
            <el-button type="primary" size="small"
              @click="durationSelectorVisible = true">
              设置
            </el-button>
          </span>
        </div>
      </section>
      <section class="creative">
        <promotion-creative-tip></promotion-creative-tip>
        <div>
          <aside>推广标题:</aside>
          <span>
            <el-input type="text" style="width: 420px"
              placeholder="请输入标题 ~ (字数限制为9-25个字)"
              :disabled="!isCreativeEditable || isFormReadonly"
              :value="getProp('creativeTitle')"
              @change="v => promotion.creativeTitle = v">
            </el-input>
            <p v-if="isCreativeAuthing" class="authing-tip">
              您的推广物料正在审核中，预计审核时间3个工作日内，请您耐心等待。
            </p>
          </span>
        </div>
        <div>
          <aside style="align-items: flex-start; padding-top: 5px;">
            推广内容:
          </aside>
          <span>
            <el-input type="textarea" :rows="5" style="width: 420px"
              :placeholder="creativeContentPlaceholder"
              :disabled="!isCreativeEditable || isFormReadonly"
              :value="getProp('creativeContent')"
              @change="v => promotion.creativeContent = v">
            </el-input>
          </span>
          <p>{{ originPromotion.refuseReason }}</p>
        </div>
        <footer v-if="!isFormReadonly">
          <el-button type="primary" @click="checkCreativeContent">
            检查推广是否可用
          </el-button>
        </footer>
      </section>
      <section class="keyword">
        <header>选取推广关键词</header>
        <h4>
          <span>已经设置的关键词</span>
          <label>当前关键词数量: {{ currentKeywords.length }}个</label>
        </h4>
        <keyword-list :words="currentKeywords"
          :selectable="false"
          :deletable="!isFormReadonly"
          :show-prop-show="false"
          :show-prop-status="true"
          :show-prop-ranking="true"
          @update-word="updateExistWord"
          @delete-word="word => promotion.deletedKeywords.push(word)">
        </keyword-list>
        <h3 v-if="!isFormReadonly">
          <label>关键词不够？</label>
          <a @click="switchWordsVisible">点此自定义添加</a>
        </h3>
        <div v-if="newaddedWordsVisible">
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
        <keyword-list v-if="newaddedWordsVisible" :words="addibleWords"
          :selected-words="promotion.newKeywords"
          @update-word="updateNewWord"
          @select-words="words => promotion.newKeywords = [...words]">
        </keyword-list>
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
            <el-input :disabled="isFormReadonly"
              type="number" placeholder="请输入每日最高预算"
              :value="getProp('dailyBudget')"
              @change="v => promotion.dailyBudget = v">
            </el-input>
          </span>
          <i>元</i>
          <span>
            （根据您选取的关键词，最低预算为<p>{{ predictedInfo.dailyBudget }}</p>元）
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
        <promotion-charge-tip></promotion-charge-tip>
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
      :schedule="(getProp('schedule') || []).join(',')"
      @change="onChangeDuration"
      @hide="durationSelectorVisible = false">
    </duration-selector>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import isEqual from 'lodash.isequal'
import uuid from 'uuid/v4'

import PromotionAreaLimitTip from 'com/widget/promotion-area-limit-tip'
import QiqiaobanPageSelector from 'com/common/qiqiaoban-page-selector'
import PromotionCreativeTip from 'com/widget/promotion-creative-tip'
import CashcowPageSelector from 'com/common/cashcow-page-selector'
import PromotionChargeTip from 'com/widget/promotion-charge-tip'
import PromotionRuleLink from 'com/widget/promotion-rule-link'
import DurationSelector from 'com/common/duration-selector'
import KeywordList from 'com/common/qwt-keyword-list'
import AreaSelector from 'com/common/area-selector'
import ContractAck from 'com/widget/contract-ack'
import Topbar from 'com/topbar'

import { fmtAreasInQwt, getCnName } from 'util/meta'
import { disabledDate } from 'util/element'
import { isBaixingSales } from 'util/role'
import track from 'util/track'

import {
  CREATIVE_STATUS_PENDING,
  SEM_PLATFORM_BAIDU,
  SEM_PLATFORM_QIHU
} from 'constant/fengming'

import {
  creativeContentPlaceholder
} from 'constant/tip'

import {
  checkCampaignValidTime,
  getCampaignPrediction,
  getCampaignValidTime
} from 'util/campaign'

import {
  centToYuan
} from 'utils'

import {
  checkCreativeContent,
  getRecommendedWords,
  getCurrentBalance,
  getCampaignInfo,
  updateCampaign,
  setTimeType,
  clearStore
} from './action'

import store from './store'

const isArray = Array.isArray

export default {
  name: 'qwt-update-promotion',
  store,
  components: {
    PromotionAreaLimitTip,
    QiqiaobanPageSelector,
    PromotionCreativeTip,
    CashcowPageSelector,
    PromotionChargeTip,
    PromotionRuleLink,
    DurationSelector,
    AreaSelector,
    KeywordList,
    ContractAck,
    Topbar
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
      creativeContentPlaceholder,
      actionTrackId: '',

      durationSelectorVisible: false,
      newaddedWordsVisible: false,
      areaDialogVisible: false,
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
      }
    }
  },
  computed: {
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

      return keywords.filter(w => {
        return !deletedKeywords.map(i => i.id).includes(w.id)
      }).map(w => {
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

      return this.recommendedWords.filter(w => !words.includes(w.word.toLowerCase()))
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
    isCreativeEditable() {
      // 说明: sougou 审核中, 不允许修改创意; 但 360 可以
      if ([SEM_PLATFORM_QIHU, SEM_PLATFORM_BAIDU].includes(this.getProp('source'))) {
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
    id() {
      return this.$route.params.id
    }
  },
  methods: {
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
        getCampaignInfo(this.id),
        getCurrentBalance()
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
        landingPage: originLandingPage,
        landingType: originLandingType
      } = this.originPromotion
      // 说明: 如下四个值, 分为2组, 每一组要么都不传, 要么都传
      const {
        creativeContent,
        creativeTitle,

        landingPage,
        landingType
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

      if (changed(landingPage, originLandingPage) ||
        changed(landingType, originLandingType)) {
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
      if ((dailyBudget !== undefined) && (dailyBudget < pp)) {
        throw new Error(`推广日预算需大于 ${pp} 元`)
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

      const { userInfo, id } = this

      track({
        roles: userInfo.roles.map(r => r.name).join(','),
        action: 'click-button: update-campaign',
        actionTrackId: this.actionTrackId,
        baixingId: userInfo.baixingId,
        time: Date.now() / 1000 | 0,
        baxId: userInfo.id,
        campaignId: id
      })

      this.actionTrackId = uuid()

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
        if (w.price < 100) {
          return Message.error(`关键字: ${w.word} 出价不得低于 1元, 请调高出价`)
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

      await clearStore()

      this.$router.push({
        name: 'qwt-promotion-list'
      })
    },
    async queryRecommendedWords() {
      const { queryWord } = this

      if (!queryWord) {
        return Message.error('请输入查询关键词')
      }

      await getRecommendedWords(queryWord)
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
    disabledDate,
    setTimeType,
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
    await clearStore()
  },
  async mounted() {
    await this.initCampaignInfo()

    setTimeout(() => {
      const { userInfo, id } = this
      this.actionTrackId = uuid()

      track({
        roles: userInfo.roles.map(r => r.name).join(','),
        action: 'enter-page: update-campaign',
        actionTrackId: this.actionTrackId,
        baixingId: userInfo.baixingId,
        time: Date.now() / 1000 | 0,
        baxId: userInfo.id,
        campaignId: id
      })
    }, 1200)
  }
}
</script>

<style scoped>

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
          margin-right: 20px;
          color: #6a778c;
          font-size: 14px;
        }
      }
    }

    & > section.creative {
      & > div:nth-child(3) {
        & > p {
          margin-left: 15px;
          font-size: 12px;
          line-height: 1.75;
          color: #ff1400;
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

</style>
