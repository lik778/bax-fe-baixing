<template>
  <div class="homepage-container">
    <topbar :userInfo="userInfo">
      <label slot="title">首页</label>
    </topbar>
    <h1 class="welcome">{{userInfo.name}}, 欢迎回来~</h1>
    <section-header>我的账户</section-header>
    <el-row type="flex" justify="center" class="row">
      <el-col :span="4" class="block">
        <h3>我的推广</h3>
        <p><span class="number">{{summary.campaignCount}}</span>个</p>
        <router-link :to="{name: 'qwt-promotion-list'}">
          <el-button type="primary">管理</el-button>
        </router-link>
      </el-col>
      <el-col :span="4" class="block">
        <h3>可用优惠券</h3>
        <p><span class="number">{{coupons.length}}</span>张</p>
        <router-link :to="{name: 'coupon'}">
          <el-button type="primary">查看</el-button>
        </router-link>
      </el-col>
      <el-col :span="4" class="block">
        <h3>推广可用资金</h3>
        <p><span class="number">{{summary.balance / 100}}</span>元</p>
        <router-link :to="{name: 'qwt-charge', query: {mode: 'charge-only'}}">
          <el-button type="primary">充值</el-button>
        </router-link>
      </el-col>
      <el-col :span="4"></el-col>
      <el-col :span="4"></el-col>
    </el-row>
    <section-header>系统公告</section-header>
    <section-header>推广状态通知</section-header>
  </div>
</template>

<script>
  import SectionHeader from 'com/common/section-header'
  import Topbar from 'com/topbar'

  import { allowSeeAccount } from 'util/role'

  import store from './store'

  import {
    getHomepageSummary,
    getCoupons
  } from './action'

  export default {
    name: 'homepage',
    props: ['userInfo'],
    store,
    components: {
      Topbar,
      SectionHeader
    },
    computed: {
      allowSeeAccount() {
        return allowSeeAccount(this.userInfo.roles)
      }
    },
    watch: {
      async userInfo(user) {
        if (this.allowSeeAccount) {
          await Promise.all([
            getHomepageSummary(),
            getCoupons()
          ])
        }
      }
    }
  }
</script>

<style scoped>
  .homepage-container {
    padding: 0 35px;
    width: 100%;
    color: #6a778c;
  }
  .welcome {
    margin-bottom: 20px;
  }
  .block {
    text-align: center;
    margin: 20px 0;
    border-right: 1px dotted #aaa;
  }
  .number {
    color: #2276f2;
    font-size: 20px;
    margin: 10px 5px;
  }
</style>
