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
                        :is-sales="isSales"
                        :promotion="promotion"
                        :current-balance="currentBalance"
                        @update-promotion="(type, data) => (promotion[type] = data)">
          <negative-words-comp :negative-words="promotion.negativeWords"
                               :all-words="promotion.negativeWords"
                               :campaign-id="campaignId"
                               :is-sales="isSales"
                               @track="(action, opts) => handleTrack(action, opts)"
                               @add-negative-words="(words) =>(promotion.negativeWords = words.concat(promotion.negativeWords))"
                               @remove-negative-words="(idx) => promotion.negativeWords.splice(idx, 1)"
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
                   :disabled="isSales"
                   class="add-group-btn">
          <i class="el-icon-plus" />
          新增单元
        </el-button>
        <group-table-comp :campaign-id="campaignId"
                          :is-sales="isSales" />
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
                   :disabled="isUpdating || isSales"
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

import { isBaixingSales } from 'util/role'
import { getCurrentBalance, getCampaignInfo, updateCampaign } from 'api/fengming'
import clone from 'clone'
import pick from 'lodash.pick'
import { toHumanTime } from 'utils'
import isEqual from 'lodash.isequal'
import { CAMPAIGN_STATUS_OFFLINE } from 'constant/fengming'
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

      isUpdating: false,
      actionTrackId: uuid()
    }
  },
  computed: {
    isSales () {
      return isBaixingSales(this.userInfo.roles)
    },
    campaignId () {
      return this.$route.params.id
    },
    isCampaignOffline () {
      const { status } = this.originPromotion
      return status === CAMPAIGN_STATUS_OFFLINE
    }
  },
  async mounted () {
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

    this.handleTrack('enter-page: update-campaign')
  },
  methods: {
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
      const info = await getCampaignInfo(this.campaignId)
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
    async initCampaignInfo () {
      this.originPromotion = await this.getCampaignInfo()
      this.promotion = pick(clone(this.originPromotion), ['areas', 'dailyBudget', 'validTime', 'negativeWords', 'schedule', 'budgetModificationCount', 'source'])
      this.currentBalance = await getCurrentBalance()
    },
    async updatePromotion () {
      try {
        await this.validatePromotion()
        this.isUpdating = true
        this._updatePromotion()
      } catch (e) {
        return this.$message.error(e.message)
      } finally {
        this.isUpdating = false
      }
    },
    async _updatePromotion () {
      const data = {}
      Object.assign(data, {
        ...this.getUpdatedPromotionData(),
        ...this.getUpdatedNegativeWordData()
      })

      await updateCampaign(this.campaignId, data)

      this.handleTrack('leave-page: update-campaign')

      this.$router.push({ name: 'qwt-promotion-list' })
    },
    async validatePromotion () {
      if (!this.$refs.contract.$data.isAgreement) {
        throw new Error('请阅读并勾选同意服务协议，再进行下一步操作')
      }
      if (this.isUpdating) {
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
      const { areas, dailyBudget, schedule, validTime } = this.promotion

      if (!isEqual(areas, this.originPromotion.areas)) {
        data.areas = areas
      }

      if (dailyBudget !== this.originPromotion.dailyBudget) {
        data.dailyBudget = dailyBudget * 100
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
  margin: 14px;
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
      .add-group-btn {
        margin-bottom: 20px;
      }
      .el-icon-plus {
        margin-right: 4px;
      }
      .contract-ack {
        margin-top: 0;
      }
      .update-btn {
        margin: 20px 0;
      }
    }
  }
}
</style>
