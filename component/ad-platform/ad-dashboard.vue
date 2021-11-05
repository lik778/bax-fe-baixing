<template>
  <section class="ad-platform-dashboard">
    <h3 class="title">资金概览</h3>
    <ul>
      <li>
        <span>今日消耗（元）</span>
        <span>{{f2y(founds.cost)}}</span>
      </li>
      <li>
        <span>账户余额（元）</span>
        <span>{{f2y(founds.balance)}}</span>
      </li>
      <li>
        <span>累计充值（元）</span>
        <span>{{f2y(founds.amount)}}</span>
      </li>
    </ul>
    <h3 class="title">数据概览</h3>
    <DataRange @getDate="getDate" @searchData="changeDateRange"/>
    <div class="chart-content">
      <div class="chart-line">
        <ECharts v-if="lineChartList && lineChartList.length" style="width: 100%; max-width: 100%; margin-top: 20px"
        :options="chartLineOptions"></ECharts>
      </div>
      <!-- <div class="chart-pie">
        <ECharts style="width: 100%; max-width: 50%; margin-top: 20px"
        :options="chartPieOptions"></ECharts>
      </div> -->
    </div>
    <CostList :tableData="costList"/>
  </section>
</template>
<script>
import { DataRange } from 'com/bw-plus/components'
import { statistic, costList, foundsInfo } from 'api/ad-platform'
import { f2y } from 'util'
import CostList from './cost-list.vue'
import { chartLineOptions, chartPieOptions } from './constant'
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/legend'
export default {
  name: 'ad-dashboard',
  components: {
    DataRange,
    ECharts,
    CostList
  },
  data () {
    return {
      daterange: [],
      founds: {},
      statistic: {},
      lineChartList: [],
      pieChartList: [],
      costList: [],
      f2y,
      chartLineOptions,
      chartPieOptions
    }
  },
  async mounted () {
    await this.initData()
  },
  methods: {
    getDate (daterange) {
      this.daterange = daterange
    },
    async changeDateRange (daterange) {
      this.daterange = daterange
      await Promise.all([
        this.getCostList(),
        this.getStatistic()
      ])
    },
    async getFounds () {
      const { data } = await foundsInfo()
      this.founds = data
    },
    async getCostList () {
      const { daterange } = this
      const params = {
        startDate: daterange[0].format('YYYY-MM-DD'),
        endDate: daterange[1].format('YYYY-MM-DD')
      }
      const { data } = await costList(params)
      this.costList = data
    },
    async getStatistic () {
      const { daterange } = this
      const params = {
        startDate: daterange[0].format('YYYY-MM-DD'),
        endDate: daterange[1].format('YYYY-MM-DD')
      }
      const { data: { lineChartList, pieChartList } } = await statistic(params)
      chartLineOptions.series.forEach(item => {
        item.data = lineChartList.map(o => o[item.id])
      })
      this.lineChartList = lineChartList
      this.pieChartList = pieChartList
    },
    async initData () {
      await Promise.all([
        this.getFounds(),
        this.getCostList(),
        this.getStatistic()
      ])
    }
  }
}
</script>
<style lang="scss" scoped>
    .ad-platform-dashboard{
        min-height: 100%;
        background: #fff;
        margin: 10px;
        box-sizing: border-box;
        .chart-content{
          margin-bottom: 30px;
        }
        .title{
            margin-bottom: 10px;
        }
        ul{
            padding: 0;
            display: flex;
            padding: 20px;
            background: #eee;
            margin-bottom: 30px;
            li{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                &:nth-child(2){
                    margin: 0 30px;
                }
                span:nth-child(1){
                    margin-bottom: 10px;
                }
                span:nth-child(2){
                    color: #ff4f49;
                    font-size: 20px;
                    font-weight: bold;
                }
            }
        }
    }
</style>
