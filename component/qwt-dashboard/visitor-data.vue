<template>
  <div class="visitor">
    <div class="select">
      <span class="select-campaign">选择计划</span>
      <el-select v-model="campaignId">
        <el-option
          v-for="item in campaignIds"
          :key="item.id"
          :value="item.id"
        />
      </el-select>
    </div>
    <div class="consume-container">
      <div class="info">
        <span>扣费统计</span>
        <span class="tip"
          >(按点击扣费，当前计划实扣点击单价为
          <span class="red">{{ $formatter.f2y(deductInfo.unitPrice) }}元</span>)
        </span>
      </div>
      <div class="detail">
        <div class="detail-item">
          <div class="title">近7天消耗（元）</div>
          <div class="cost">
            {{ $formatter.f2y(deductInfo.lastSevenDaysConsumption) }}
          </div>
        </div>
        <div class="split"></div>
        <div class="detail-item">
          <div class="title">昨日消耗（元）</div>
          <div class="cost">
            {{ $formatter.f2y(deductInfo.yesterdayConsumption) }}
          </div>
        </div>
      </div>
    </div>

    <visitor-detail
      class="visitor-detail-container"
      :campaign-id="campaignId"
    />
  </div>
</template>

<script>
import { getValidateCampaigns, getDeductStatistic } from 'api/fengming-campaign'
import VisitorDetail from './visitor-detail'

export default {
  name: 'VisitorData',
  components: {
    VisitorDetail,
  },
  props: {
    userInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      campaignId: '',
      campaignIds: [],
      deductInfo: {
        lastSevenDaysConsumption: 0,
        yesterdayConsumption: 0,
        unitPrice: 0,
      },
    }
  },
  methods: {
    async getFinalUserId() {
      const { user_id: userId } = this.$route.query
      if (userId) return userId
      return this.userInfo && this.userInfo.id
    },
    async handleValidateCampaigns() {
      const uid = await this.getFinalUserId()
      if (!uid) return
      this.campaignIds = await getValidateCampaigns(uid)
      this.campaignId = this.campaignIds[0].id
    },
    async handleDeductStatistic() {
      const res = await getDeductStatistic(this.campaignId)
      this.deductInfo = {
        ...this.deductInfo,
        ...res,
      }
    },
  },
  watch: {
    userInfo: {
      immediate: true,
      deep: true,
      handler(newVal) {
        this.handleValidateCampaigns()
      },
    },
    campaignId(newVal) {
      this.handleDeductStatistic()
    },
  },
}
</script>

<style lang="scss" scoped>
.visitor {
  color: #666;
  & > .select {
    & > .select-campaign {
      margin: 0 8px 0 18px;
      color: #333;
      font-size: 16px;
      font-weight: 600;
    }
  }
  & > .consume-container {
    font-size: 14px;
    padding: 17px 20px;
    margin-top: 30px;
    border: 1px solid #e6e6e6;
    border-radius: 2px;
    & > .info {
      font-size: 14px;
      & > .tip {
        padding-left: 6px;
        font-size: 12px;
        color: #6d6d6d;
        text-align: left;
        & .red {
          color: #ff4f49;
        }
      }
    }
    & > .detail {
      display: flex;
      align-items: center;
      margin: 20px 0 0 64px;
      & > .detail-item {
        text-align: left;
      }
      & > .split {
        align-self: stretch;
        border-left: 1px solid #e6e6e6;
        margin: 4px 30px;
      }
      & .cost {
        color: #ff4f49;
        margin-top: 6px;
        font-size: 24px;
        font-weight: 600;
      }
    }
  }
  & > .visitor-detail-container {
    margin-top: 34px;
  }
}
</style>
