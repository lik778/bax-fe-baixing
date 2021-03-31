<template>
  <div class="promotion-update">
    <div class="module">
      <h3>推广计划：{{ campaignId }}</h3>
    </div>
    <!-- 计划设置 -->
    <div class="module">
      <h4>计划设置</h4>
      <div class="content">
        <promotion-comp
          :is-sales="isSales"
          :all-areas="allAreas"
          :promotion="promotion"
          :current-balance="currentBalance"
          @update-negative-words="(negativeWords) => updatePromotionData('negativeWords', negativeWords)"
          @update-promotion="updatePromotionData"
        />
      </div>
    </div>

    <!-- 单元设置 -->
    <div class="module">
      <h4>单元设置</h4>
      <div class="content">
        <el-button
          @click="handleGoGroup"
          type="primary"
          size="small"
          class="add-group-btn">
          <i class="el-icon-plus" />
          新增单元
        </el-button>
        <group-table-comp
          :group-data="groupData"
          @update-group-data="updateGroupData"
        />
      </div>
    </div>

    <!-- 更新推广 -->
    <div class="module">
      <div class="content">
        <contract-ack class="contract-ack" type="content-rule" ref="contract" />
        <el-button class="update-btn" type="primary" :disabled="isUpdating || isSales" @click="updatePromotion">
          更新推广
        </el-button>
        <promotion-charge-tip />
      </div>
    </div>
  </div>
</template>

<script>
import PromotionComp from './promotion'
import GroupTableComp from 'com/common/qwt/group-table'
import ContractAck from 'com/widget/contract-ack'
import PromotionChargeTip from 'com/widget/promotion-charge-tip'

import { isBaixingSales } from 'util/role'
import { getCurrentBalance, getCampaignInfo } from 'api/fengming'
import clone from 'clone'
import pick from 'lodash.pick'
import { toHumanTime } from 'utils'
import isEqual from 'lodash.isequal'
import { MIN_DAILY_BUDGET, CAMPAIGN_STATUS_OFFLINE } from 'constant/fengming'
import { getCampaignValidTime } from 'util/campaign'

const emptyPromtion = {
  status: 0,
  source: 0,
  areas: [],
  budgetModificationCount: 0,
  schedule: [],
  dailyBudget: 0,
  validTime: []
}

export default {
  name: 'qwt-update-promotion',
  components: {
    PromotionComp,
    GroupTableComp,
    ContractAck,
    PromotionChargeTip
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
      originPromotion: null, // 计划原始数据
      promotion: emptyPromtion, // 当前计划
      currentBalance: 0,

      isUpdating: false,
      groupData: [
        {
          id: 1,
          name: '轿车推广',
          status: '投放中',
          semStatus: '创',
          avg: 0.00
        },
        {
          id: 1,
          name: '轿车推广',
          status: '投放中',
          semStatus: '创',
          avg: 0.00
        },
        {
          id: 1,
          name: '轿车推广',
          status: '投放中',
          semStatus: '创',
          avg: 0.00
        }
      ]
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
    // TODO: 打点需求
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
    async getCampaignInfo () {
      // TODO: 根据计划id获取计划详情
      const info = await getCampaignInfo(this.campaignId)
      info.dailyBudget = info.dailyBudget / 100
      if (info.timeRange && info.timeRange.length && info.timeRange[0] !== null && info.timeRange[1] !== null) {
        info.validTime = [
          toHumanTime(info.timeRange[0], 'YYYY-MM-DD'),
          toHumanTime(info.timeRange[1], 'YYYY-MM-DD')
        ]
      } else {
        info.validTime = []
      }
      return info
    },
    async initCampaignInfo () {
      this.originPromotion = await this.getCampaignInfo()
      this.promotion = pick(clone(this.originPromotion), ['areas', 'dailyBudget', 'validTime', 'negativeWords', 'schedule', 'budgetModificationCount', 'source'])
      this.currentBalance = await getCurrentBalance()
      // TODO: 获取所有单元详情
    },
    updatePromotionData (type, data) {
      this.promotion[type] = data
    },
    updateGroupData (row) {
    },
    updatePromotion () {
      try {
        this.validatePromotionData()
        this.isUpdating = true
        this._updatePromotion()
      } catch (e) {
        return this.$message.error(e.message)
      } finally {
        this.isUpdating = false
      }
    },
    _updatePromotion () {
      const data = {}
      Object.assign(data, {
        ...this.getUpdatedPromotionData(),
        ...this.getUpdatedNegativeWordData()
      })

      // TODO: 调用updateCampaign接口
      // TODO: 是否要做打点
      this.$router.push({ name: 'qwt-promotion-list' })
    },
    validatePromotionData () {
      const { areas, dailyBudget, validTime } = this.promotion
      if (!this.$refs.contract.$data.isAgreement) {
        throw new Error('请阅读并勾选同意服务协议，再进行下一步操作')
      }
      if (this.isUpdating) {
        throw new Error('正在更新中, 请稍等一会儿 ~')
      }
      if (!areas.length) {
        throw new Error('请选择投放区域')
      }
      if (dailyBudget * 100 < MIN_DAILY_BUDGET) {
        throw new Error(`推广日预算需大于 ${this.$formatter.f2y(MIN_DAILY_BUDGET)} 元`)
      }
      if (dailyBudget > 10000000) {
        throw new Error('推广日预算太高啦！您咋这么土豪呢~')
      }
      if (!validTime.length) {
        throw new Error('请填写投放日期或选择长期投放')
      }
    },
    getUpdatedPromotionData () {
      const data = {}
      const { areas, dailyBudget, schedule, validTime } = this.promotion

      const areasUnion = [...new Set([...areas, this.originPromotion.areas])]
      if (areasUnion.length !== areas.length) {
        data.areas = areas
      }

      if (dailyBudget !== this.originPromotion.dailyBudget) {
        data.dailyBudget = dailyBudget * 100
      }

      const scheduleUnion = [...new Set([...schedule, this.originPromotion.schedule])]
      if (scheduleUnion.length !== schedule.length) {
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
      const newNegativeKeywords = negativeWords.filter(x => !originNegativeWords.find(o => o.word === x.word))
      const deletedNegativeKeywords = originNegativeWords.filter(x => !negativeWords.find(o => o.word === x.word))
      if (newNegativeKeywords.length) data.newNegativeKeywords = newNegativeKeywords
      if (deletedNegativeKeywords.length) data.deletedNegativeKeywords = deletedNegativeKeywords
      return data
    },
    handleGoGroup () {
      this.$router.push({ name: 'qwt-create-group' })
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
