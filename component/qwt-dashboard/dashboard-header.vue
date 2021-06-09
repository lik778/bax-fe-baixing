<template>
  <div class="header">
    <h3>今日数据</h3>
    <div class="c-div-con">
      <div class="c-div">
        <p>展现（次）</p>
        <p class="bold">{{data.shows}}</p>
      </div>
      <div class="c-div">
        <p>点击（次）</p>
        <p class="bold">{{data.clicks}}</p>
      </div>
      <div class="c-div">
        <p>消费（元）</p>
        <p class="bold">{{f2y(data.consume)}}</p>
      </div>
      <div class="split"></div>
      <div class="c-div">
        <p>站外推广余额：<span class="highlight">{{f2y(data.balance)}}</span>元</p>
        <p v-if="data.budget !== 0">预计还可消耗：<span class="highlight">{{Math.floor(data.balance/data.budget)}}</span>天</p>
        <p v-else>当前账户无消耗</p>
      </div>
      <div>
        <router-link v-if="userInfo.allowFmRecharge" :to="{name: 'qwt-charge'}"><el-button type="primary" plain="">充值</el-button></router-link>
        <router-link :to="{name: 'qwt-create-promotion'}"><el-button type="primary" icon="el-icon-plus">新建站外推广</el-button></router-link>
      </div>
    </div>
    <template v-if="creatives.length > 0">
      <h3>计划关键词概览</h3>
      <div
        class="c-creative-con"
        v-for="item in creatives"
        :key="item.campaignId">
          <div class="c-div">
            <p class="c-div-title">计划ID</p>
            <p class="bold">{{item.campaignId}}</p>
          </div>
          <div class="c-div">
            <p class="c-div-title">总词数</p>
            <p class="bold">{{item.currentKeywordCount}}</p>
          </div>
          <div class="c-div">
            <p class="c-div-title">消耗词数</p>
            <p class="bold">{{item.consumeKeywordCount}}</p>
          </div>
      </div>
    </template>
  </div>
</template>

<script>
import * as api from 'api/fengming'
import { getAllCampaignsWithConsume } from 'api/fengming-campaign'
import { f2y } from 'util'

export default {
  name: 'dashboard-header',
  props: ['userInfo'],
  data () {
    return {
      data: {},
      creatives: []
    }
  },
  async mounted () {
    this.initDatas()
    this.initCreatives()
  },
  methods: {
    async initDatas () {
      this.data = await api.getDashboardHeader()
    },
    async initCreatives () {
      this.creatives = await getAllCampaignsWithConsume()
    },
    f2y
  }
}
</script>

<style lang="scss" scoped>
.header {
  color: #717d91;
  background-color: #eff2f7;
  font-size: 14px;
  margin-bottom: 20px;
  padding: 20px 18px;

  h3 {
    font-size: 16px;
    color: black;
  }

  & > .c-div-con {
    display: flex;
    align-items: center;
    height: 50px;

    .c-div {
      margin-right: 30px;
      text-align: left;

      &.split {
        align-self: stretch;
        border: 1px solid #ddd;
      }
    }
  }
}
.highlight {
  color: #ff8273;
  margin: 5px;
}
.bold {
  font-weight: bold;
  margin-top: 5px;
}
.c-creative-con {
  display: flex;
  align-items: center;
  .c-div {
    width: 98px;
  }
}
.c-div-con + h3 {
  margin-top: 20px;
}
h3 + .c-creative-con {
  margin-top: 10px;
}
.c-creative-con + .c-creative-con .c-div-title {
  display: none;
}
</style>
