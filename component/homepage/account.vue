<template>
  <div class="layout-container">
    <div class="layout-left">
      <h5 class="layout-header">账户概览</h5>
      <ul class="accout">
        <li class="account-item">
          <p class="title">站外推广余额(元)</p>
          <p class="num" v-cloak>{{fengmingBalance.price}}</p>
          <p class="desc" v-cloak>（可消耗 {{fengmingBalance.day}} 天）</p>
          <el-button type="primary" class="button" size="small" @click.native="() => handleCharge('bax')">立即充值</el-button>
        </li>
        <li class="account-item">
          <p class="title">标王推广关键词(个)</p>
          <p class="num" v-cloak>{{0}}</p>
          <p class="desc" v-cloak>（ {{5}} 个词即将到期）</p>
          <el-button type="primary" class="button" size="small" @click.native="() => handleCharge('biaowang')">立即充值</el-button>
        </li>
        <li class="account-item">
            <p class="title">精品官网(个)</p>
            <p class="num" v-cloak>{{0}}</p>
            <p class="desc" v-cloak> （ {{'2019.1.1'}} 到期）</p>
            <el-button type="primary" class="button" size="small" @click.native="() => handleCharge('site')">立即充值</el-button>
        </li>
      </ul>
    </div>
    <div class="layout-right">
      <h5 class="layout-header">
        账户推广通知
        <span class="action" v-if="notices && notices.length">更多</span>
      </h5>
      <notice :notice-list="notices" type="fengming" height="179px">
        <template slot-scope="{notice}">
          {{notice.formatDate(notice.ts * 1000)}} {{notice.content}}
        </template>
      </notice>
    </div>
  </div>
</template>

<script>
import store from './store'
import Notice from './notice'

export default {
  name: 'homepage-accout',
  components: {Notice},
  fromMobx: {
    fengmingBalance: () => store.fengmingBalance,
    notices: () => store.notices.fengming
  },
  methods: {
    handleCharge(type) {
      switch(type) {
        case 'bax':
          return this.$router.push({name: 'qwt-charge'})
        case 'site':
          return this.$router.push({name: 'qwt-charge', query: {select_gw: 1}})
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
  .accout {
    display: flex;
    align-items: center;
    color: #666;
    font-size: 14px;
    text-align: center;
    padding-top: 30px;
    line-clamp: 1;
    & .account-item {
      flex: 1;
      &:not(:last-of-type) {
        border-right: 1px solid #e6e6e6;
      }
    }
    & .title {
      font-weight: 600;
    }
    & .num {
      color: #FF4F49;
      font-weight: 600;
      font-size: 24px;
      line-height: 50px;
    }
    & .desc {
      font-size: 12px;
    }
    & .button {
      width: 110px;
      height: 32px;
      margin: 20px 0;
    }
  }
</style>
