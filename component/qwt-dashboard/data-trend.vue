
<template>
  <div class="qwt-dashboard-data-trend">
    <header>
      2017.09 - 2017.10 数据走势图
    </header>
    <main>
      <chart :options="options" />
    </main>
  </div>
</template>

<script>

import { toHumanTime } from 'utils'

export default {
  name: 'qwt-dashboard-data-trend',
  props: {
    statistics: {
      type: Array,
      required: true
    }
  },
  computed: {
    rows() {
      return this.statistics.sort((a, b) => a.date > b.date)
    },
    days() {
      return this.rows.map(r => toHumanTime(r.date, 'MMDD'))
    },
    costData() {
      return this.rows.map(r => r.cost / 100)
    },
    showData() {
      return this.rows.map(r => r.shows)
    },
    clickData() {
      return this.rows.map(r => r.clicks)
    },
    options() {
      return {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['消费', '展现', '点击量']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.days
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '消费',
          type: 'line',
          stack: '消费',
          data: this.costData
        }, {
          name: '展现',
          type: 'line',
          stack: '展现',
          data: this.showData
        }, {
          name: '点击量',
          type: 'line',
          stack: '点击量',
          data: this.clickData
        }]
      }
    }
  }
}

</script>

<style scoped>

.qwt-dashboard-data-trend {
  margin: 50px 0 30px;

  & > header {
    display: flex;
    align-items: center;
    height: 35px;
    padding-left: 30px;
    border-radius: 3px;
    background: #e5e9f2;
    font-size: 14px;
    color: #6a778c;
  }
}

</style>
