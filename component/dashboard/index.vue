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
    <el-row :gutter="40">
      <el-col :span="16">
        <el-row :gutter="20" class="row">
          <el-col :span="4"><span class="label">业务进度</span></el-col>
          <el-col :span="20">
            <el-progress class="product-progress" :text-inside="true" :stroke-width="24" :percentage="sumProgress"></el-progress>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4"><span class="label">时间进度</span></el-col>
          <el-col :span="20">
            <el-progress class="time-progress" :text-inside="true" :stroke-width="18" :percentage="timeProgress"></el-progress>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8">
        some number
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
        tubiao
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Topbar from 'com/topbar'
import ProductBoard from './productBoard'
import moment from 'moment'
import { summaryOfProduct, setRange } from './action'
import store from './store'
export default {
  name: 'dashboard',
  store,
  data() {
    return {
      yesterday: [],
      productData: { sum: {}}
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
  },
  methods: {
    setRange(v) {
      setRange(v)
      summaryOfProduct(v).then(() => {
        this.productData = this[this.range]
      })
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
    }
  },
  components: {
    Topbar,
    ProductBoard
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
.label {
  font-size: .8em;
  color: #666;
  padding-left: 15px;
}
</style>
<style>
  .time-progress .el-progress-bar__inner {
    background-color: #6196bd;
  }
  .product-progress .el-progress-bar__inner {
    background-color: #f7b909;
  }
</style>