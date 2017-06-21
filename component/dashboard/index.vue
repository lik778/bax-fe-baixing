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
    <router-link :to="{name: 'upload-profit'}" class="upload-btn">
      <el-button type="primary">每日上传<i class="el-icon-upload el-icon--right"></i></el-button>
    </router-link>
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
        <div class="target">{{ rangeSum.target | currency('￥', 0) }}</div>
        <h4 class="label">指标</h4>
      </el-col>
      <el-col :span="8">
        <el-row :gutter="50" type="flex" justify="center">
          <el-col :span="10">
            <h3>{{rangeSum.yesterday | currency('￥', 0) }}</h3>
            <h4 class="label">昨日利润</h4>
            <hr>
            <h3>{{profitEachDay | currency('￥', 0) }}</h3>
            <h4 class="label">日均利润</h4>
          </el-col>
          <el-col :span="10">
            <h3>{{leftProfitEachDay | currency('￥', 0) }}</h3>
            <h4 class="label">剩余日均</h4>
            <hr>
            <h3>{{rangeSum.current | currency('￥', 0) }}</h3>
            <h4 class="label">累计完成</h4>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="40">
      <el-col :span="8" v-for="(v, product) in productData" :key="product">
        <product-board :title="product" :target="v.target" :done="v.current" :done-yesterday="v.yesterday"/>
      </el-col>
    </el-row>
    <el-row :gutter="40">
      <el-col :span="24"><div class="bar bg-light">{{chartTitle}}</div></el-col>
      <el-col :span="24">
        <chart id="trend-chart" :options="lineOptions" ref="trend" auto-resize></chart>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Topbar from 'com/topbar'
import ProductBoard from './ProductBoard'
import moment from 'moment'
import { summaryOfProduct, setRange, getTrend } from './action'
import store from './store'
import MyProgress from 'com/common/my-progress'

export default {
  name: 'dashboard',
  store,
  data() {
    return {
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
    this.load('month')
  },
  methods: {
    load(range) {
      summaryOfProduct(range)
      getTrend(range).then(data => { setTimeout( () =>  { this.parseOption(data, range) }) })
    },
    setRange(v) {
      setRange(v)
      this.load(v)
    },
    parseOption(raw, range) {
      let start, end, dates = [], result = {}
      if(range === 'month') {
        start = -60
        end = -1
      } else if(range === 'quarter') {
        start = 1
        end = 12
      } else if(range === 'year') {
        start = 1
        end = 4
      }
      for (; start <= end; start++) {
        let curDate = range === 'month' ? +moment().add(start, 'days').format('YYYYMMDD'): start
        for (var i = 0; i < this.products.length; i++) {
          let curProduct = this.products[i], has = false
          if(!result[curProduct]) result[curProduct] = []
          for (var j = 0; j < raw.length; j++) {
              if(raw[j]['date'] ===  curDate && raw[j]['product'] === this.products[i]) {
                result[curProduct].push(raw[j]['profit'])
                has = true
              }
            }
          if(!has) result[curProduct].push(null)
        }
        dates.push(curDate)
      }
      const series = this.products.map(product => ({
        name: product,
        type: range === 'year' ? 'bar': 'line',
        data: result[product]
      }))

      this.lineOptions = {
        xAxis: {
            name: range === 'month' ? '日期': (range === 'quarter' ? '月份': '季度'),
            data: dates,
            axisLabel: {
              interval: 0,
              rotate: range ==='month' ? 90 : 0
            }
        },
        tooltip: {
            show: true
        },
        yAxis: {
          name: '单位:元'
        },
        legend: {
          data: this.products
        },
        series
      }

    }
  },
  computed: {
    sumProgress() {
      const { current, target } = this.rangeSum
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
      return Math.floor( this.rangeSum.current / passed )
    },
    leftProfitEachDay() {
      const left = moment().endOf('month').date() - moment().date()
      if(left > 0) {
        return Math.floor( this.rangeSum.target / ( left ) )
      } else {
        return this.rangeSum.target
      }
    },
    chartTitle() {
      if(this.range === 'month') {
        return '各业务近60天业绩趋势'
      }
      if(this.range === 'quarter') {
        return '各业务每月业务趋势'
      }
      if(this.range === 'year') {
        return '各业务分季度业绩统计'
      }
    },
    productData() {
      return this[this.range]
    },
    rangeSum() {
      let sum = {
        current: 0,
        target: 0,
        yesterday: 0
      }
      for(const p in this.productData) {
        sum['current'] += this.productData[p]['current'] || 0
        sum['target'] += this.productData[p]['target'] || 0
        sum['yesterday'] += this.productData[p]['yesterday'] || 0
      }
      return sum
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
  margin-bottom: 50px;
}
.upload-btn {
  float: right;
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
