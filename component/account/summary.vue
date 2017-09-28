<template>
  <div class="summary-container">
    <section-header>我的账户</section-header>
    <el-row type="flex" justify="space-around">
      <el-col :span="6">
        <div class="line">
          <p>推广资金余额</p>
          <p><strong>{{summary.balance / 100}}</strong>元</p>
          <router-link :to="{name: 'qwt-charge', query: {mode: 'charge-only'}}"><el-button type="primary">充值</el-button></router-link>
        </div>
      </el-col>
      <el-col :span="12">
        <el-row>
          <el-col :span="8">
            <p>今日预算：{{summary.budget / 100}}元</p>
          </el-col>
          <el-col :span="8">
            <div class="btns">
              <router-link :to="{name: 'qwt-promotion-list'}"><el-button type="primary">推广管理</el-button></router-link>
            </div>
            <div>
              <router-link :to="{name: 'qwt-create-promotion'}"><el-button type="primary">新建推广</el-button></router-link>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import SectionHeader from 'com/common/section-header'
  import { getSummary } from './action'
  import store from './store'

  export default {
    name: 'summary',
    store,
    components: {
      SectionHeader
    },
    mounted() {
      getSummary()
    }
  }
</script>

<style scoped>
  .line {
    border-right: 1px dotted #aaa;
    text-align: center;
  }
  p {
    margin: 10px 0;
  }
  .btns {
    margin-bottom: 10px;
  }
</style>
