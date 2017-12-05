<template>
  <div class="summary-container">
    <section-header>我的账户</section-header>
    <el-row type="flex" justify="space-around" align="center">
      <el-col :span="4"></el-col>
      <el-col :span="4" class="column">
        <h3>推广资金余额</h3>
        <p><strong>{{summary.balance / 100}}</strong>元</p>
        <router-link :to="{name: 'qwt-charge', query: {mode: 'charge-only'}}"><el-button type="primary">充值</el-button></router-link>
      </el-col>
      <el-col :span="4" class="column">
        <h3>可用优惠券</h3>
        <p><span class="number">{{coupons.length}}</span>张</p>
        <router-link :to="{name: 'coupon'}"><el-button type="primary">查看</el-button></router-link>
      </el-col>
      <el-col :span="8" class="column">
        <el-row class="multi">
          <el-col :span="12">
            <h3>今日预算：{{summary.budget / 100}}元</h3>
          </el-col>
          <el-col :span="12">
            <div class="btn">
              <router-link :to="{name: 'qwt-promotion-list'}"><el-button type="primary">推广管理</el-button></router-link>
            </div>
            <div class="btn">
              <router-link :to="{name: 'qwt-create-promotion'}"><el-button type="primary">新建推广</el-button></router-link>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="4"></el-col>
    </el-row>
  </div>
</template>

<script>
  import SectionHeader from 'com/common/section-header'
  import { getSummary, getCoupons } from './action'
  import store from './store'

  export default {
    name: 'summary',
    store,
    components: {
      SectionHeader
    },
    mounted() {
      getSummary()
      getCoupons({ onlyValid: true, status: 0 })
    }
  }
</script>

<style scoped>
  .column {
    text-align: center;
  }
  p {
    margin: 10px 0;
  }
  .multi {
    display: flex;
    align-items: center;
    width: 100%;
  }
  .btn {
    margin-bottom: 10px;
  }
</style>
