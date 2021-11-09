<template>
  <section class="ad-platform-dashboard">
    <h3 class="title">资金概览</h3>
    <Founds :founds="founds"/>
    <h3 class="title">数据概览</h3>
    <DataRange :daterangeListMall="daterangeList" :subtractDay="0" @getDate="getDate" @searchData="changeDateRange"/>
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
import Founds from '../components/funds.vue'
import { statistic, costList, foundsInfo } from 'api/ad-platform'
import CostList from '../components/cost-list.vue'
import { chartLineOptions, chartPieOptions } from '../constant'
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/legend'
import dayjs from 'dayjs'
const daterangeList = [
  {
    id: 5,
    label: '今日',
    daterange: [
      dayjs().subtract(0, 'day'),
      dayjs().subtract(0, 'day')
    ]
  }
]
export default {
  name: 'ad-dashboard',
  components: {
    DataRange,
    ECharts,
    CostList,
    Founds
  },
  data () {
    return {
      daterangeList,
      daterange: [],
      founds: {},
      statistic: {},
      lineChartList: [],
      pieChartList: [],
      costList: [],
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
        item.data = lineChartList.map(o => item.render(o[item.id]))
      })
      chartLineOptions.xAxis.data = lineChartList.map(o => o.date)
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
<style lang="scss" scoped src="./index.scss" />
