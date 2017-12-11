
<template>
  <div class="qwt-dashboard-data-trend">
    <header>
      数据走势图
    </header>
    <main>
      <chart :options="options"></chart>
    </main>
  </div>
</template>

<script>
import { toTimestamp } from 'utils'
import clone from 'clone'

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
      const items = clone(this.statistics.sort((a, b) => {
        if (a.date.includes('~')) {
          // 2017-01-01 ~ 2017-02-02
          return toTimestamp(a.date.split('~').shift().trim()) -
            toTimestamp(b.date.split('~').shift().trim())
        } else {
          return toTimestamp(a.date) - toTimestamp(b.date)
        }
      }))

      return items.reduce((pre, now) => {
        const last = pre.pop()
        if (!last) {
          return [now]
        }

        if (last.date === now.date) {
          // merge
          return [...pre, {
            clicks: last.clicks + now.clicks,
            shows: last.shows + now.shows,
            cost: last.cost + now.cost,
            date: last.date
          }]
        } else {
          return [...pre, last, now]
        }
      }, [])
    },
    days() {
      return this.rows.map(r => r.date)
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
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.days,
          axisLabel: {
            rotate: 60
          }
        },
        yAxis: [{
          type: 'value',
          position: 'left',
          min: 0,
          max: Math.max(...this.costData)
        }, {
          type: 'value',
          position: 'right',
          min: 0,
          max: Math.max(...[...this.showData, ...this.clickData])
        }],
        series: [{
          name: '消费',
          type: 'line',
          stack: '消费',
          yAxisIndex: 0,
          data: this.costData
        }, {
          name: '展现',
          type: 'line',
          stack: '展现',
          yAxisIndex: 1,
          data: this.showData
        }, {
          name: '点击量',
          type: 'line',
          stack: '点击量',
          yAxisIndex: 1,
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
