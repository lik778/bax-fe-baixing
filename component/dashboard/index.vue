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
          <el-col :span="4">业务进度</el-col>
          <el-col :span="20">
            <el-progress class="product-progress" :text-inside="true" :stroke-width="24" :percentage="70"></el-progress>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">时间进度</el-col>
          <el-col :span="20">
            <el-progress class="time-progress" :text-inside="true" :stroke-width="18" :percentage="60"></el-progress>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8">
        some number
      </el-col>
    </el-row>
    <el-row :gutter="40">
      <el-col :span="8"><product-board :title="'站内广告'" :target="100" :done="100" :done-yesterday="20"/></el-col>
      <el-col :span="8"><product-board :title="'凤鸣业务'" :target="100" :done="80" :done-yesterday="20"/></el-col>
      <el-col :span="8"><product-board :title="'大客户业务'" :target="100" :done="20" :done-yesterday="20"/></el-col>
      <el-col :span="8"><product-board :title="'站外广告'" :target="100" :done="20" :done-yesterday="20"/></el-col>
      <el-col :span="8"><product-board :title="'拼框业务'" :target="100" :done="20" :done-yesterday="20"/></el-col>
      <el-col :span="8"><product-board :title="'众托帮'" :target="100" :done="20" :done-yesterday="20"/></el-col>
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
import { summaryOfProduct } from './action'
import store from './store'
export default {
  name: 'dashboard',
  store,
  data() {
    return {
      yesterday: []
    }
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  mounted() {
    summaryOfProduct('month')
  },
  methods: {
    setRange(v) {
      console.log(v)
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
</style>
<style>
  .time-progress .el-progress-bar__inner {
    background-color: #6196bd;
  }
  .product-progress .el-progress-bar__inner {
    background-color: #f7b909;
  }
</style>