<template>
    <section class="bw-plus-dashboard">
        <h2>昨日数据</h2>
        <p>展现（次)<br/>199</p>
        <el-tabs v-model="activeName">
            <el-tab-pane label="计划维度" name="promote"></el-tab-pane>
            <el-tab-pane label="关键词维度" name="keyword"></el-tab-pane>
        </el-tabs>
        <DataRange @searchData="searchData"/>
        <ECharts style="width: 100%; max-width: 1300px; margin-top: 20px"
        :options="chartOptions"></ECharts>
    </section>
</template>
<script>
import { DataRange } from './components'
import ECharts from 'vue-echarts/components/ECharts.vue'
import dayjs from 'dayjs'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/line'
const chartOptions = {
  xAxis: {
    type: 'category',
    data: [dayjs().format('YYYY-MM-DD')]
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line'
    }
  ]
}
export default {
  name: 'bw-plus-dashboard',
  components: { DataRange, ECharts },
  data () {
    return {
      activeName: 'promote',
      showChartData: [],
      chartOptions
    }
  },
  methods: {
    searchData (daterange) {
      console.log(daterange)
    }
  }
}
</script>
<style lang="scss" scoped>
   .bw-plus-dashboard{
        min-height: 100%;
        background: #fff;
        margin: 10px;
        box-sizing: border-box;
   }
</style>
