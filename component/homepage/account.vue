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
      <ul class="notice-list" v-if="notices">
        <template v-if="notices.length">
          <li
            class="notice-item"
            v-for="notice in notices"
            :key="notice.id"
          >
            2018.9.21 【站外推广】您的计划（id）由于（xx原因）未通过，请去广告系统修改后重新提交！
          </li>
        </template>
        <div v-else class="notice-placeholder"><i class="el-icon-info" />暂无账户推广通知</div>
      </ul>
    </div>
  </div>
</template>

<script>
import store from './store'

export default {
  name: 'homepage-accout',
  fromMobx: {
    fengmingBalance: () => store.fengmingBalance,
    notices: () => store.notices.fengming
  },
  methods: {
    handleCharge(type) {
      switch(type) {
        case 'bax':
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
  .notice-list {
    color: #666;
    font-size: 14px;
    & .notice-item {
      margin-top: 20px;
      overflow : hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
  .notice-placeholder {
    height: 184px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 16px;
    & .el-icon-info {
      margin-right: 4px;
    }
  }
</style>
