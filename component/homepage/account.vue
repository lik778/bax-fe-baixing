<template>
  <div class="layout-container">
    <div class="layout-left" v-if="isShowSection('fengming') || isShowSection('biaowang')">
      <h5 class="layout-header">账户概览</h5>
      <ul class="accout">
        <li class="account-item" v-if="isShowSection('fengming') && isYibaisouBiao">
          <p class="title">百搜凤鸣投放币（元) <span class="sub-title">不含冻结</span></p>
          <p class="num">{{fengmingBalance.price}}</p>
          <p class="desc" :style="{ marginBottom: userInfo.allowFmRecharge ? '' : '72px' }">（冻结金额 {{fengmingBalance.freezeBalance}} 元）</p>
          <!-- <el-button v-if="userInfo.allowFmRecharge" type="primary" class="button" size="small" @click.native="() => handleCharge('bax')">立即充值</el-button> -->
        </li>
        <li class="account-item" v-if="isShowSection('biaowang')  && !isYibaisouBiao">
          <p class="title">标王投放币（元) </p>
          <p class="num">{{ biaowangBalance.price }}</p>
          <!-- <p class="desc">（ {{biaowangData.nearExpirationPromotes}} 个词即将到期）</p> -->
          <el-button type="primary" class="button" size="small" @click.native="() => handleCharge('biaowang')">管理标王推广</el-button>
        </li>
        <li class="account-item" v-if="isShowSection('biaowang') &&  !isYibaisouBiao">
          <p class="title">省心币（元) </p>
          <p class="num">{{ adPlatformBalance.price }}</p>
          <p class="desc" :style="{ marginBottom: userInfo.allowCareFreeRecharge ? '' : '72px' }"></p>
          <el-button v-if="userInfo.allowCareFreeRecharge" type="primary" class="button" size="small" @click.native="() => handleCharge('adPlatform')">立即充值</el-button>
        </li>
      </ul>
    </div>
    <loading-placeholder class="layout-left" v-else>
      <h5 class="layout-header" slot="header">账户概览</h5>
      正在获取推广数据
    </loading-placeholder>
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
import store from './store'
import Notice from './notice'
import loadingPlaceholder from './loading-placeholder'
import { MERCHANTS } from 'constant/product'
import {
  isNormalUser,
  isYibaisouSales
} from 'util/role'

export default {
  name: 'homepage-accout',
  components: { Notice, loadingPlaceholder },
  props: ['userInfo'],
  fromMobx: {
    fengmingBalance: () => store.fengmingBalance,
    biaowangBalance: () => store.biaowangBalance,
    adPlatformBalance: () => store.adPlatformBalance,
    notices: () => store.notices.fengming,
    sites: () => store.kaSiteData && store.kaSiteData.sites,
    biaowangData: () => store.biaowangData
  },
  computed: {
    isYibaisouBiao () {
      const { roles, isYibaisouUser } = this.userInfo
      if (isNormalUser(roles)) {
        if (!isYibaisouUser) {
          return false
        }
      } else {
        if (!isYibaisouSales(roles)) {
          return false
        }
      }
      return true
    }
  },
  methods: {
    handleCharge (type) {
      const { CARE_FREE_MERCHANT_CODE } = MERCHANTS
      switch (type) {
        case 'bax':
          return this.$router.push({ name: 'qwt-charge' })
        case 'site':
          return this.$router.push({ name: 'qwt-charge', query: { select_gw: 1 } })
        case 'biaowang':
          return this.$router.push({ name: 'bw-plus-package-list' })
        case 'adPlatform':
          return this.$router.push({ name: 'qwt-charge', query: { from: CARE_FREE_MERCHANT_CODE } })
      }
    },
    isShowSection (sectionType) {
      switch (sectionType) {
        case 'fengming':
          console.log(this.fengmingBalance.price, '进来了')
          return this.fengmingBalance.price !== null && this.fengmingBalance.day !== null
        case 'biaowang':
          return this.biaowangData
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
  & .sub-title {
    font-size: 10px;
    color: #666;
    font-weight: 400;
  }
  & .num {
    color: #ff4f49;
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
