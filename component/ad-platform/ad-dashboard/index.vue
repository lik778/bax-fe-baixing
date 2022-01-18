<template>
  <section class="ad-platform-dashboard">
    <h3 class="title">资金概览</h3>
    <Founds :founds="founds"/>
    <h3 class="title"><span  :class="cueVisible?'active':null" @click="cueVisible=false">数据概览</span><span :class="cueVisible?null:'active'" @click="cueVisibleList">线索中心</span></h3>
    <div v-if="cueVisible==false">
      <DataRange :daterangeListMall="daterangeList" :subtractDay="0" @getDate="getDate" @searchData="changeDateRange"/>
      <div class="chart-content" >
        <div class="chart-line" >
          <ECharts v-if="lineChartList && lineChartList.length" style="width: 100%; max-width: 100%; margin-top: 20px"
          :options="chartLineOptions"></ECharts>
        </div>
        <!-- <div class="chart-pie">
          <ECharts style="width: 100%; max-width: 50%; margin-top: 20px"
          :options="chartPieOptions"></ECharts>
        </div> -->
      </div>
    </div>
    <CostList :tableData="costList" v-if="cueVisible==false"/>
    <Cluecenter :tableData="ciueCenterList" v-if="cueVisible==true" @getList="getCiueCenterList"/>
  </section>
</template>
<script>
import { DataRange } from 'com/bw-plus/components'
import Founds from '../components/funds.vue'
import { statistic, costList, foundsInfo, ciueCenterList } from 'api/ad-platform'
import CostList from '../components/cost-list.vue'
import Cluecenter from '../components/clue-center.vue'
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
    Founds,
    Cluecenter
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
      ciueCenterList: [],
      chartLineOptions,
      chartPieOptions,
      cueVisible: false,
      total: 0,
      userId: this.$route.query.user_id
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
        this.getStatistic(),
        this.getCiueCenterList()
      ])
    },
    async getFounds () {
      const { query: { user_id: userId } } = this.$route
      const { data } = await foundsInfo({ userId })
      this.founds = data
    },
    async getCostList () {
      const { daterange, $route: { query: { user_id: userId } } } = this
      const params = {
        startDate: daterange[0].format('YYYY-MM-DD'),
        endDate: daterange[1].format('YYYY-MM-DD'),
        userId
      }
      const { data } = await costList(params)
      this.costList = data
    },
    async getCiueCenterList () {
      const params = {
        page: 1,
        size: 10,
        userId: this.userId
      }
      const { data: { total, list } } = await ciueCenterList(params)
      this.ciueCenterList = list
      this.total = total
    },
    cueVisibleList () {
      this.cueVisible = true
      this.getCiueCenterList()
    },
    async getStatistic () {
      const { daterange, $route: { query: { user_id: userId } } } = this
      const params = {
        startDate: daterange[0].format('YYYY-MM-DD'),
        endDate: daterange[1].format('YYYY-MM-DD'),
        userId
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
        this.getStatistic(),
        this.getCiueCenterList()
      ])
    }
  }
}
</script>
<style lang="scss" scoped src="./index.scss" />
