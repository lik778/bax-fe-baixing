<template>
  <div class="layout-container">
    <div class="layout-left">
      <h5 class="layout-header">站外推广诊断</h5>
      <div class="layout-content" v-if="chartOptions && hasCampaign">
        <div class="chart">
          <e-charts :options="chartOptions"/>
        </div>
        <div class="description">
          <p>您当前的推广健康度为:<strong>{{avgScore}}</strong>分，</p>
          <p>已经超过<strong>{{higherThan}}%</strong>的用户，</p>
          <p v-if="campaignRadar.cntRejected > 0">
            您当前有计划未通过审核，请
            <a href="javascript:;" @click="goPromotionList">前往修改</a>
          </p>
          <div class="optimization" v-if="optimizablePoints.length">
            <p class="title">建议进行如下优化，提升广告效果</p>
            <div class="keywords">
              <span class="keyword"
                @click="handlePointClick(p.routerKey)"
                v-for="p in optimizablePoints"
                :key="p.key"
              >
                {{p.text}}
              </span>
            </div>
          </div>
          <div class="actions">
            <el-button type="primary" @click="() => $router.push({name: 'qwt-create-promotion'})">新建站外推广</el-button>
            <el-button type="primary" @click="() => $router.push({name: 'qwt-promotion-list'})">管理站外推广</el-button>
          </div>
        </div>
      </div>
      <div class="placeholder" v-else-if="!chartOptions"><i class="el-icon-loading" />正在获取站外推广数据</div>
      <div v-else class="no-campaign-radar-placeholder">
        <p class="text">您暂时没有站外推广，您可以</p>
        <div>
          <el-button type="primary" @click="() => $router.push({name: 'qwt-create-promotion'})">新建站外推广</el-button>
          <el-button type="primary" @click="() => $router.push({name: 'qwt-charge'})">充值推广资金</el-button>
        </div>
      </div>
    </div>
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
import clone from 'clone'
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/radar'

import store from './store'
import {
  campaignOptimization
} from 'constant/fengming'

const OPTIMIZABLE_POINTS = [
  {key: 'dailyBudget', text: '账户余额', routerKey: 'charge'},
  {key: 'cntSrc', text: '渠道', routerKey: campaignOptimization.STATUS_OPT_SOURCE},
  {key: 'kwCtr', text: '创意', routerKey: campaignOptimization.STATUS_OPT_CREATIVE},
  {key: 'cntNonDefault', text: '投放设置', routerKey: campaignOptimization.STATUS_OPT_SETTING},
  {key: 'kwPrice', text: '出价', routerKey: campaignOptimization.STATUS_OPT_PRICE},
  {key: 'avgCntKw', text: '关键词', routerKey: campaignOptimization.STATUS_OPT_KEYWORD}
]

const formatPrice = (p) => {
  return p ? (p / 100).toFixed(2) : 0
}

const chartOptionsTmpl = {
  title: {
    text: '站外推广健康度'
  },
  tooltip: {
    trigger: 'item',
    backgroundColor : 'rgba(53, 165, 228, 0.8)'
  },
  radar: [
    {
      indicator: OPTIMIZABLE_POINTS.map(({text}) => ({text, max: 100})),
      center: ['45%','55%'],
      radius: '70%',
      axisLine: {
        lineStyle: {
          color: ['#666'],
          opacity: 0.15
        }
      },
      splitLine: {
        lineStyle: {
          color: ['#ddd', '#ddd', '#ddd', '#ddd', '#ddd', '#35A5E4']
        }
      }
    }
  ],
  series: [
    {
      name: '站外推广健康度(分)',
      type: 'radar',
      itemStyle: {
        color: ['#FF8955']
      },
      lineStyle: {
        color: ['#FF6350']
      },
      areaStyle: {
        color: ['#FF6350'],
        opacity: 0.6
      },
      data: [
        {
          value: []
        }
      ]
    }
  ]
}

const genChartOptions = value => {
    const opt = clone(chartOptionsTmpl)
    opt.series[0].data[0].value = value
    return Object.freeze(opt)
}

const CNT_REJECTED_CODE = '-53'

export default {
  name: 'homepage-campaign',
  components: {
    ECharts
  },
  data() {
    return {
      chartOptions: null,
      reportPrefix: '',
      radarScores: [],
      avgScore: '0',
      higherThan: '0'
    }
  },
  fromMobx: {
    fengmingData: () => store.fengmingData,
    campaignRadar: () => store.campaignRadar
  },
  computed: {
    reportData() {
      const prefix = this.reportPrefix
      const data = this.fengmingData
      if (!data) return [0, 0, 0, 0]

      const keys = ['Budget', 'Consume', 'Shows', 'Clicks']
      if (prefix) {
        return keys.map(k => data[prefix + k])
      }
      return keys.map(k => data[k.toLowerCase()])
    },
    optimizablePoints() {
      const scores = this.radarScores
      return OPTIMIZABLE_POINTS.filter((_, index) => {
        if (scores[index] < 60) return true
      })
    },
    hasCampaign() {
      return this.campaignRadar && this.campaignRadar.cntCampaign > 0
    }
  },
  methods: {
    formatPrice,
    handlePointClick(key) {
      if (key === 'charge') return this.$router.push({name: 'qwt-charge'})
      this.$router.push({name: 'qwt-promotion-list', query: {
        statuses: key
      }})
    },
    goPromotionList() {
      this.$router.push({name: 'qwt-promotion-list', query: {
        statuses: CNT_REJECTED_CODE
      }})
    }
  },
  watch: {
    campaignRadar(val) {
      if (!val) return
      const radarScores = this.radarScores = OPTIMIZABLE_POINTS.map(({key}) => parseInt(val[key]))
      this.chartOptions = genChartOptions(radarScores)
      this.avgScore = (radarScores.reduce((t, s) => t + s, 0) / radarScores.length).toFixed(1)
      this.higherThan = (val.higherThan * 100).toFixed(1)
    }
  }
}
</script>

<style lang="postcss" scoped>
 @define-mixin placeholder {
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
      & >>> .echarts {
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
        color: #FF6350;
        margin: 0 4px;
      }
      & a {
        letter-spacing: 0;
        color: #35A5E4;
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
        color: #B66969;
        background-color: #FFF5F5;
        border-radius: 2px;
        cursor: pointer;
        transition: color, background-color .1s;
        &:hover {
          background-color: #ffe0e0;
          color: #B64949;
        }
      }
    }
    & .actions {
      margin-top: 25px;
      & >>> .el-button {
        min-width: 110px;
        padding: 8px 12px;
      }
    }
    & .placeholder {
      color: #888;
      line-height: 288px;
      text-align: center;
      font-size: 18px;
      letter-spacing: 1px;
      & .el-icon-loading {
        font-size: 20px;
        margin-right: 5px;
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
      & >>> .el-radio__label {
        font-weight: 600;
      }
    }
    & .reports {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      &:after {
        content: '';
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
          color: #FF4F49;
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
    @mixin placeholder;
    font-size: 16px;
    & .el-icon-info {
      margin-right: 4px;
    }
  }

  .no-campaign-radar-placeholder {
    @mixin placeholder;
    font-size: 17px;
    & .text {
      margin-bottom: 20px;
    }
  }
</style>
