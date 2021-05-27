<template>
  <div class="layout-container">
    <slot name="left" />
    <div class="layout-right">
      <h5 class="layout-header">
        站外推广数据概览
        <span class="action" @click="() => $router.push({name: 'qwt-dashboard'})">查看详情</span>
      </h5>
      <div class="layout-content" v-if="hasCampaign">
        <div class="radio-group">
          <el-radio v-model="reportPrefix" label="">今日</el-radio>
          <el-radio v-model="reportPrefix" label="yesterday">昨日</el-radio>
          <el-radio v-model="reportPrefix" label="weekly">过去7天</el-radio>
        </div>
        <ul class="reports">
          <li class="report">
            <h6 class="title">预算(元)</h6>
            <p class="num">{{formatPrice(reportData[0])}}</p>
          </li>
          <li class="report">
            <h6 class="title">消耗(元)</h6>
            <p class="num">{{formatPrice(reportData[1])}}</p>
          </li>
          <li class="report">
            <h6 class="title">展现量</h6>
            <p class="num">{{reportData[2]}}</p>
          </li>
          <li class="report">
            <h6 class="title">点击量</h6>
            <p class="num">{{reportData[3]}}</p>
          </li>
        </ul>
      </div>
      <div class="no-campaign-data-placeholder" v-else>
        <span><i class="el-icon-info" />暂无站外推广数据概览</span>
      </div>
    </div>
  </div>
</template>

<script>
import store from './store'
const formatPrice = (p) => {
  return p ? (p / 100).toFixed(2) : 0
}

const CNT_REJECTED_CODE = '-53'

export default {
  name: 'homepage-campaign',
  props: ['userInfo'],
  data () {
    return {
      reportPrefix: '',
      radarScores: []
    }
  },
  fromMobx: {
    fengmingData: () => store.fengmingData
  },
  computed: {
    reportData () {
      const prefix = this.reportPrefix
      const data = this.fengmingData
      if (!data) return [0, 0, 0, 0]

      const keys = ['Budget', 'Consume', 'Shows', 'Clicks']
      if (prefix) {
        return keys.map(k => data[prefix + k])
      }
      return keys.map(k => data[k.toLowerCase()])
    },
    hasCampaign () {
      // 空 fengmingData 说明没有有效的计划
      return Object.keys(this.fengmingData || {}).length > 0
    }
  },
  methods: {
    formatPrice,
    handlePointClick (key) {
      if (key === 'charge') return this.$router.push({ name: 'qwt-charge' })
      this.$router.push({
        name: 'qwt-promotion-list',
        query: {
          statuses: key
        }
      })
    },
    goPromotionList () {
      this.$router.push({
        name: 'qwt-promotion-list',
        query: {
          statuses: CNT_REJECTED_CODE
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin placeholder {
  display: flex;
  height: 288px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #999;
}
.layout-left {
  & .layout-content {
    display: flex;
    min-height: 288px;
  }
  & .chart {
    width: 55%;
    flex: 1;
    & /deep/ .echarts {
      width: 100%;
      height: 100%;
    }
  }
  & .description {
    width: 45%;
    flex: 1;
    padding-top: 25px;
    line-height: 36px;
    letter-spacing: 1px;
    & strong {
      font-size: 24px;
      font-weight: 600;
      color: #ff6350;
      margin: 0 4px;
    }
    & a {
      letter-spacing: 0;
      color: #35a5e4;
    }
  }
  & .optimization {
    line-height: 1.6;
    margin-top: 22px;
    & .title {
      font-weight: 600;
    }
    & .keyword {
      display: inline-block;
      font-size: 13px;
      margin-top: 8px;
      margin-right: 8px;
      padding: 3px 6px;
      color: #b66969;
      background-color: #fff5f5;
      border-radius: 2px;
      cursor: pointer;
      transition: color, background-color 0.1s;
      &:hover {
        background-color: #ffe0e0;
        color: #b64949;
      }
    }
  }
  & .actions {
    margin-top: 25px;
    & /deep/ .el-button {
      min-width: 110px;
      padding: 8px 12px;
    }
  }
}
.layout-right {
  & .radio-group {
    display: flex;
    justify-content: space-around;
    width: 66%;
    max-width: 350px;
    margin: 32px auto;
    & /deep/ .el-radio__label {
      font-weight: 600;
    }
  }
  & .reports {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    &:after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      background-color: #fff;
      height: 16%;
      width: 18%;
      z-index: 1;
    }
    & > .report {
      flex: 1 0 50%;
      height: 110px;
      text-align: center;
      padding-top: 14px;
      line-height: 2;
      & .num {
        color: #ff4f49;
        font-size: 24px;
        font-weight: 600;
      }
      &:nth-of-type(2n + 1) {
        border-right: 1px solid #e6e6e6;
      }
      &:nth-of-type(1) {
        border-bottom: 1px solid #e6e6e6;
      }
      &:nth-of-type(2) {
        border-bottom: 1px solid #e6e6e6;
      }
    }
  }
}

.no-campaign-data-placeholder {
  @include placeholder;
  font-size: 16px;
  & .el-icon-info {
    margin-right: 4px;
  }
}

.no-campaign-radar-placeholder {
  @include placeholder;
  font-size: 17px;
  & .text {
    margin-bottom: 20px;
  }
}
</style>
