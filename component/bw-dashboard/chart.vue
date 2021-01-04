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
import dayjs from 'dayjs'
import clone from 'clone'
import { DEVICE } from 'constant/biaowang'
import { getCnName } from 'util'

const chartOptionTmp =  {
  title: {
    show: false
  },
  legend: {
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
  series: []
}


export default {
  name: 'bw-dashboard-chart',
  components: {
    ECharts
  },
  props: {
    chartData: {
      type: Array,
      required: true,
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
  methods: {
    cityFormatter(cities) {
      const max = 3
      return cities.slice(0, max).map(
        city => getCnName(city, this.allAreas)).join(',') + (cities.length > max 
        ? `等${cities.length}个城市` 
        : '')
    },
    getChartOptions(data) {
      let seriesData = data.map((res) => {
        let name = `${res.word}_${DEVICE[res.device]}`
        return {
          name: name,
          type: 'line',
          data: res.showList || res.rankList
        }
      })
      this.loading = true
      let options = clone(chartOptionTmp)
      let timeList = data[0].timeList.map((item) => dayjs(item*1000).format('YYYY-MM-DD'))
      let legendsData = seriesData.reduce((list, item) => {
        return list.concat(item.name)
      }, [])
      options.xAxis.data = timeList
      options.yAxis.name = this.yAxisName
      options.series = seriesData
      options.legend.data = legendsData
      this.chartOptions = options
      this.loading = false
    }
  },
  watch: {
    chartData: {
      deep: true,
      immediate: true,
      handler(data) {
        this.getChartOptions(data)
      }
    }
  }
}
</script>