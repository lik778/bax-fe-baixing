<template>
  <div class="wrapper">
    <topbar :userInfo="userInfo">
      <label slot="title">数据报表</label>
    </topbar>
    <el-radio-group :value="range" @input="setRange">
      <el-radio-button label="month">月度</el-radio-button>
      <el-radio-button label="quarter">季度</el-radio-button>
      <el-radio-button label="year">年度</el-radio-button>
    </el-radio-group>
    <el-row :gutter="40">
      <el-col :span="24"><div class="bar bg-light">总体指标完成度</div></el-col>
    </el-row>
    <el-row :gutter="40" type="flex" align="middle">
      <el-col :span="12">
        <el-row :gutter="20" class="row">
          <el-col :span="4"><span class="progress-label">业务进度</span></el-col>
          <el-col :span="20">
            <my-progress id="product-progress" :text-inside="true" :stroke-width="24" :percentage="sumProgress"></my-progress>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4"><span class="progress-label">时间进度</span></el-col>
          <el-col :span="20">
            <my-progress id="time-progress" :text-inside="true" :stroke-width="18" :percentage="timeProgress"></my-progress>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="4">
        <div class="target">{{productData.sum.target}}</div>
        <h4 class="label">指标</h4>
      </el-col>
      <el-col :span="8">
        <el-row :gutter="50" type="flex" justify="center">
          <el-col :span="10">
            <h3>{{productData.sum.yesterday}}</h3>
            <h4 class="label">昨日利润</h4>
            <hr>
            <h3>{{profitEachDay}}</h3>
            <h4 class="label">日均利润</h4>
          </el-col>
          <el-col :span="10">
            <h3>{{leftProfitEachDay}}</h3>
            <h4 class="label">剩余日均</h4>
            <hr>
            <h3>{{productData.sum.current}}</h3>
            <h4 class="label">累计完成</h4>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="40">
      <el-col :span="8" v-for="(v, product) in productData" :key="product" v-if="product !== 'sum'">
        <product-board :title="product" :target="v.target" :done="v.current" :done-yesterday="v.yesterday"/>
      </el-col>
    </el-row>
    <el-row :gutter="40">
      <el-col :span="24"><div class="bar bg-light">各业务近60天业绩趋势</div></el-col>
      <el-col :span="24">
        <chart id="trend-chart" :options="lineOptions" ref="trend" auto-resize></chart>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Topbar from 'com/topbar'
import ProductBoard from './productBoard'
import moment from 'moment'
import { summaryOfProduct, setRange, getTrend } from './action'
import store from './store'
import MyProgress from 'com/common/my-progress'

export default {
  name: 'dashboard',
  store,
  data() {
    return {
      yesterday: [],
      productData: { sum: {} },
      lineOptions: {}
    }
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  mounted() {
    summaryOfProduct('month').then(() => {
      this.productData = this[this.range]
    })
    getTrend().then(this.parseOption)
  },
  methods: {
    setRange(v) {
      setRange(v)
      summaryOfProduct(v).then(() => {
        this.productData = this[this.range]
      })
    },
    parseOption(raw) {
      const reduced = raw.reduce((a, c) => {
        const { date, product, profit } = c
        if( !a[date] ) {
            a[date] = {}
        }
        a[date][product] = profit
        return a
      }, {})
      let start = moment().subtract(60, 'days')
      const end = moment().subtract(1, 'days')
      let dates = [], result = {}
      while(!start.isAfter(end, 'day')) {
        const dateKey = start.format('YYYY-MM-DD')
        this.products.forEach(product => {
          if( !result[product] ) result[product] = []
          if( reduced[dateKey]) {
            result[product].push( +reduced[dateKey][product] || null )
          } else {
            result[product].push(null)
          }
        })
        dates.push(start.format('M-DD'))
        start = start.add(1, 'days')
      }
      const series = this.products.map(product => ({
        name: product,
        type: 'line',
        data: result[product]
      }))
      this.lineOptions = {
        xAxis: {
            data: dates,
            axisLabel: {
              interval: 0,
              rotate: 90
            }
        },
        tooltip: {
            show: true
        },
        yAxis: {},
        legend: {
          data: this.products
        },
        series
      }

    }
  },
  computed: {
    sumProgress() {
      const { current, target } = this.productData.sum
      if(!target) return 0
      return Math.floor( ( current / target ) * 100 )
    },
    timeProgress() {
      const days = moment().endOf('month').date()
      const passed = moment().date()
      return Math.floor( passed / days * 100 )
    },
    profitEachDay() {
      const passed = moment().date()
      return Math.floor( this.productData.sum.current / passed )
    },
    leftProfitEachDay() {
      const left = moment().endOf('month').date() - moment().date()
      if(left > 0) {
        return Math.floor( this.productData.sum.target / ( left ) )
      } else {
        return this.productData.sum.target
      }
    }
  },
  components: {
    Topbar,
    ProductBoard,
    MyProgress,
  }
}
</script>

<style scoped>
.wrapper {
  padding: 0 35px;
  width: 100%;
}
.bar {
  height: 40px;
  border-radius: 4px;
  margin: 15px 0;
  padding: 0 15px;
  line-height: 40px;
  color: #666;
}
.bg-light {
  background-color: #eef1f6;
}
.row {
  line-height: 24px;
  margin: 10px 0;
}
.progress-label {
  font-size: .8em;
  color: #666;
  padding-left: 15px;
}
.label {
  font-weight: normal;
  color: #888;
  font-size: .8em;
}
.target {
  color: #63D321;
  font-size: 2em;
}
h3 {
  font-size: 1.4em;
}
#trend-chart {
  height: 400px;
  width: 100%;
}
</style>
<style>
  #time-progress .el-progress-bar__inner {
    background-color: #5598D2;
  }
  #product-progress .el-progress-bar__inner {
    background-color: #F5A623;
  }
</style>