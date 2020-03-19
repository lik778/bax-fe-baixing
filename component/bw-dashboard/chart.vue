<template>
  <div>
    <e-charts style="width: 1000px; margin-top: 20px"
              :options="options"></e-charts>
  </div>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts.vue'
// import loadingPlaceholder from './loading-placeholder'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/line'

export default {
  name: 'bw-dashboard-chart',
  components: {
    ECharts
  },
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    let data = []

    for (let i = 0; i <= 360; i++) {
        let t = i / 180 * Math.PI
        let r = Math.sin(2 * t) * Math.cos(2 * t)
        data.push([r, i])
    }
    return {
      options: {
        title: {
          show: true,
          text: '平均排名'
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: true,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
            data: [820, 932, 901, 934, 1290, 1330, 1320],
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
    }
  }
}
</script>