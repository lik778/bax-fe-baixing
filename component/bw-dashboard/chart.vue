<template>
  <div v-loading="loading">
    <e-charts style="width: 100%; max-width: 1300px; margin-top: 20px"
              :options="chartOptions"></e-charts>
  </div>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/line'
import clone from 'clone'
import dayjs from 'dayjs'

const chartOptionTmp =  {
  title: {
    show: false
  },
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '4%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
      type: 'category',
      name: '日期',
      boundaryGap: true,
      data: [dayjs().format('YYYY-MM-DD')],
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
  },
  yAxis: {
      type: 'value',
      name: '平均排名',
      nameTextStyle: {
        color: '#333',
        fontSize: 14
      },
      nameGap: 30,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false
      },
      offset: 20
  },
  series: [{
      data: [5],
      type: 'line',
      smooth: false,
      lineStyle: {
        color: '#5B8FF9'
      },
      itemStyle: {
        color: '#5B8FF9'
      }
  }]
}
  

export default {
  name: 'bw-dashboard-chart',
  components: {
    ECharts
  },
  props: {
    chartData: {
      type: Object,
      required: true
    },
    yAxisName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      chartOptions: chartOptionTmp
    }
  },
  watch: {
    chartData(newVal) {
      this.loading = true
      let options = clone(chartOptionTmp)
      let timeList = newVal.timeList.map((item) => dayjs(item*1000).format('YYYY-MM-DD'))
      options.xAxis.data = timeList
      options.yAxis.name = this.yAxisName
      options.series[0].data = newVal.rankList
      this.chartOptions = options
      this.loading = false
    }
  }
}
</script>