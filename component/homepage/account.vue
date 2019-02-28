<template>
  <div class="layout-container">
    <div class="layout-left">
      <h5 class="layout-header">账户概览</h5>
      <ul class="accout">
        <li class="account-item" v-if="fengmingBalance.price && fengmingBalance.day">
          <p class="title">站外推广余额(元)</p>
          <p class="num">{{fengmingBalance.price}}</p>
          <p class="desc">（可消耗 {{fengmingBalance.day}} 天）</p>
          <el-button type="primary" class="button" size="small" @click.native="() => handleCharge('bax')">立即充值</el-button>
        </li>
        <!-- <li class="account-item">
          <p class="title">标王推广关键词(个)</p>
          <p class="num">{{0}}</p>
          <p class="desc">（ {{5}} 个词即将到期）</p>
          <el-button type="primary" class="button" size="small" @click.native="() => handleCharge('biaowang')">立即充值</el-button>
        </li> -->
        <li class="account-item" v-if="sites">
            <p class="title">精品官网(个)</p>
            <p class="num">{{sites.length}}</p>
            <p class="desc" v-if="sites.length">
              （ {{sites.length > 1 ? '最早官网到期日' : '官网到期日'}} {{noExpiredSite[0].expireAt | formatDate}} ）
            </p>
            <p class="desc" v-else>暂无精品官网</p>
            <el-button type="primary" class="button" size="small" @click.native="() => handleCharge('site')">{{sites.length === 0 ? '立即购买' : '立即续费'}}</el-button>
        </li>
      </ul>
      <div class="placeholder" v-if="!fengmingBalance.price && !fengmingBalance.day && !sites"><i class="el-icon-loading" />正在获取数据</div>
    </div>
    <div class="layout-right">
      <h5 class="layout-header">
        账户推广通知
        <span class="action" v-if="notices && notices.length" @click="$router.push('/main/notice')">更多</span>
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
import dayjs from 'dayjs'
import store from './store'
import Notice from './notice'

export default {
  name: 'homepage-accout',
  components: {Notice},
  fromMobx: {
    fengmingBalance: () => store.fengmingBalance,
    notices: () => store.notices.fengming,
    sites: () => store.kaSiteData && store.kaSiteData.sites
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
  },
  computed: {
    noExpiredSite() {
      return this.sites.filter(site => +new Date(site.expireAt) - +new Date() > 0)
    }
  },
  filters: {
    formatDate(date) {
      console.log(date)
      return dayjs(date).format('YYYY.MM.DD')
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
  .placeholder {
    color: #888;
    line-height: 189px;
    text-align: center;
    font-size: 18px;
    letter-spacing: 1px;
    & .el-icon-loading {
      font-size: 20px;
      margin-right: 5px;
    }
  }
</style>
