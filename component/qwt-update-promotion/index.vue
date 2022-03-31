<template>
  <div class="promotion-update">
    <div class="module">
      <h3>推广计划：{{ campaignId }}</h3>
    </div>
    <!-- 计划设置 -->
    <div class="module">
      <h4>计划设置</h4>
      <div class="content">
        <promotion-comp :all-areas="allAreas"
                        :is-sales="notAllowSales"
                        :promotion="promotion"
                        :current-balance="currentBalance"
                        @update-promotion="(type, data) => (promotion[type] = data)">
          <negative-words-comp :negative-words="promotion.negativeWords"
                               :all-words="promotion.negativeWords"
                               :is-sales="notAllowSales"
                               :userInfo="userInfo"
                               @track="(action, opts) => handleTrack(action, opts)"
                               @add-negative-words="addNegative"
                               @remove-negative-words="removeNegatives"
                               @remove-other-words="(word) => promotion.negativeWords.splice(word,1)"
                               slot="negative" />
        </promotion-comp>
      </div>
    </div>

    <!-- 单元设置 -->
    <div class="module">
      <h4>单元设置</h4>
      <div class="content">
        <el-button @click="handleGoGroup"
                   type="primary"
                   :disabled="notAllowSales || (groupData && groupData.length >= GROUP_MAX) || isCampaignOffline"
                   class="add-group-btn">
          <i class="el-icon-plus" />新增单元
        </el-button>
        <group-table-comp :show-columns="['name', 'frontGroupStatus', 'frontCampaignStatus', 'avgCpcRanking', 'id']"
                          :group-data="groupData"
                          @update-group-data="getGroupData()"
                          :loading="loading.fetchGroup"
                          :is-sales="notAllowSales" />
      </div>
    </div>
    <!-- 更新推广 -->
    <div class="module">
      <div class="content">
        <contract-ack class="contract-ack"
                      type="content-rule"
                      ref="contract" />
        <el-button class="update-btn"
                   type="primary"
                   :disabled="loading.updateCampaign || notAllowSales"
                   :loading="loading.updateCampaign"
                   @click="updatePromotion">
          更新推广
        </el-button>
        <promotion-charge-tip />
      </div>
    </div>
  </div>
</template>

<script>
import PromotionComp from './promotion'
import GroupTableComp from './group-table'
import ContractAck from 'com/widget/contract-ack'
import PromotionChargeTip from 'com/widget/promotion-charge-tip'
import NegativeWordsComp from 'com/common/qwt/negative-words'

import { isSales } from 'util/role'
import { getCurrentBalance, getCampaignInfo, updateCampaign, getAllGroups } from 'api/fengming'
import clone from 'clone'
import pick from 'lodash.pick'
import { toHumanTime } from 'utils'
import isEqual from 'lodash.isequal'
import { CAMPAIGN_STATUS_OFFLINE, GROUP_MAX } from 'constant/fengming'
import { getCampaignValidTime } from 'util/campaign'
import { filterExistCurrentWords } from 'util/group'
import track from 'util/track'
import uuid from 'uuid/v4'

import validator from './validate'

const emptyPromtion = {
  status: 0,
  source: 0,
  areas: [],
  budgetModificationCount: 0,
  schedule: [],
  dailyBudget: 0,
  validTime: [],
  negativeWords: []
}

export default {
  name: 'qwt-update-promotion',
  components: {
    PromotionComp,
    GroupTableComp,
    ContractAck,
    PromotionChargeTip,
    NegativeWordsComp
  },
  props: {
    userInfo: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    },
    allAreas: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      originPromotion: emptyPromtion,
      promotion: emptyPromtion,
      currentBalance: 0,
      groupData: [],

      loading: {
        updateCampaign: false,
        fetchGroup: false
      },
      actionTrackId: uuid(),

      GROUP_MAX
    }
  },
  computed: {
    notAllowSales () {
      const { query: { source } } = this.$route
      return isSales(this.userInfo.roles) && !source
    },
    campaignId () {
      return this.$route.params.id
    },
    isCampaignOffline () {
      return this.originPromotion.frontCampaignStatus === CAMPAIGN_STATUS_OFFLINE
    }
  },
  async mounted () {
    this.handleTrack('enter-page: update-campaign')

    const loadingInstance = this.$loading({
      lock: true,
      target: '.promotion-update',
      text: '正在加载中...',
      spinner: 'el-icon-loading'
    })
    try {
      await this.initCampaignInfo()
    } finally {
      loadingInstance.close()
    }
  },
  methods: {
    addNegative (words) {
      this.promotion.negativeWords = words.concat(this.promotion.negativeWords)
    },
    handleTrack (action) {
      const { actionTrackId, userInfo } = this

      track({
        roles: userInfo.roles.map(r => r.name).join(','),
        action,
        baixingId: userInfo.baixingId,
        time: Date.now() / 1000 | 0,
        baxId: userInfo.id,
        campaignId: this.campaignId,
        actionTrackId
      })
    },
    async getCampaignInfo () {
      const { query: { user_id: userId } } = this.$route
      const info = await getCampaignInfo(this.campaignId, { userId })
      info.dailyBudget = info.dailyBudget / 100
      if (info.timeRange && info.timeRange.length && info.timeRange[0] !== null && info.timeRange[1] !== null) {
        info.validTime = [
          toHumanTime(info.timeRange[0], 'YYYY-MM-DD'),
          toHumanTime(info.timeRange[1], 'YYYY-MM-DD')
        ]
      } else {
        info.validTime = [null, null]
      }
      return info
    },
    async getGroupData () {
      const { query: { user_id: userId } } = this.$route
      try {
        this.loading.fetchGroup = true
        const { data = [] } = await getAllGroups({
          campaignId: this.campaignId,
          offset: 0,
          limit: 100,
          userId
        })
        this.groupData = data
      } finally {
        this.loading.fetchGroup = false
      }
    },
    async initCampaignInfo () {
      const { query: { user_id: userId } } = this.$route
      this.originPromotion = await this.getCampaignInfo()
      this.promotion = pick(clone(this.originPromotion), ['areas', 'dailyBudget', 'validTime', 'negativeWords', 'schedule', 'budgetModificationCount', 'source', 'mobilePriceRatio', 'status', 'id', 'firstName', 'secondName', 'thirdName'])
      this.currentBalance = await getCurrentBalance({ userId })
      await this.getGroupData()
    },
    async updatePromotion () {
      try {
        await this.validatePromotion()
      } catch (e) {
        return this.$message.error(e.message)
      }

      try {
        this.loading.updateCampaign = true
        await this._updatePromotion()
      } finally {
        this.loading.updateCampaign = false
      }
    },
    async _updatePromotion () {
      const { query: { user_id: userId } } = this.$route
      const data = {}
      Object.assign(data, {
        ...this.getUpdatedPromotionData(),
        ...this.getUpdatedNegativeWordData(),
        userId
      })

      await updateCampaign(this.campaignId, data)

      this.handleTrack('leave-page: update-campaign')

      this.$router.push({ name: 'qwt-promotion-list' })
    },
    async validatePromotion () {
      if (!this.$refs.contract.$data.isAgreement) {
        throw new Error('请阅读并勾选同意服务协议，再进行下一步操作')
      }
      if (this.loading.updateCampaign) {
        throw new Error('正在更新中, 请稍等一会儿 ~')
      }

      try {
        await validator.validate(this.promotion)
      } catch (e) {
        throw new Error(e.errors[0].message)
      }
    },
    getUpdatedPromotionData () {
      function isScheduleChange (originArr, arr) {
        for (let i = 0; i < originArr.length; i++) {
          if (originArr[i] !== arr[i]) return true
        }
        return false
      }

      const data = {}
      const { areas, dailyBudget, schedule, validTime, mobilePriceRatio } = this.promotion

      // tip: dailyBudget和areas要么都传，要么都不传（呀呀呀，为啥啊？）
      if (!isEqual(areas, this.originPromotion.areas) || dailyBudget !== this.originPromotion.dailyBudget) {
        data.areas = areas
        data.dailyBudget = dailyBudget * 100
      }
      if (+this.originPromotion.mobilePriceRatio !== +mobilePriceRatio) {
        data.mobilePriceRatio = mobilePriceRatio
      }

      if (isScheduleChange(this.originPromotion.schedule, schedule)) {
        data.schedule = schedule
      }

      const computedValidTime = getCampaignValidTime(validTime)
      if (!isEqual(computedValidTime, this.originPromotion.timeRange)) {
        data.validTime = computedValidTime
      }

      return data
    },
    getUpdatedNegativeWordData () {
      const data = {}
      const { negativeWords } = this.promotion
      const originNegativeWords = this.originPromotion.negativeWords
      const newNegativeKeywords = filterExistCurrentWords(originNegativeWords, negativeWords)
      const deletedNegativeKeywords = filterExistCurrentWords(negativeWords, originNegativeWords)
      if (newNegativeKeywords.length) data.newNegativeKeywords = newNegativeKeywords
      if (deletedNegativeKeywords.length) data.deletedNegativeKeywords = deletedNegativeKeywords
      return data
    },
    handleGoGroup () {
      this.$router.push({
        name: 'qwt-create-group',
        query: { campaignId: this.campaignId }
      })
    },
    removeNegatives (words = {}) {
      const index = this.promotion.negativeWords.findIndex(item => item.word === words.word && item.matchType === words.matchType)
      this.promotion.negativeWords.splice(index, 1)
    }
  },
  watch: {
    '$route.params.id' (newV, oldV) {
      if (newV !== oldV) this.initCampaignInfo()
    }
  }
}
</script>

<style lang="scss" scoped>
.promotion-update {
  .module {
    padding: 0 24px;
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    color: #666;
    &:not(:first-child) {
      margin-top: 10px;
    }
    > h3 {
      font-size: 18px;
      color: #333;
      line-height: 50px;
      font-weight: 500;
    }
    > h4 {
      color: #666;
      line-height: 44px;
      font-size: 16px;
      font-weight: 500;
      border-bottom: 1px solid #e6e6e6;
    }
    .content {
      padding: 20px 0;
      max-width: 1200px;
      .contract-ack {
        margin-top: 0;
      }
      .update-btn {
        margin: 20px 0;
      }
      .add-group-btn {
        margin-bottom: 20px;
      }
      .el-icon-plus {
        margin-right: 4px;
      }
    }
  }
}
</style>
