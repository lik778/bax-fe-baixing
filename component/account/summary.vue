<template>
  <div class="layout-container">
    <section-header>我的账户</section-header>
    <el-row type="flex" justify="space-around" align="center">
      <el-col :span="1"></el-col>
      <!-- <el-col :span="4" class="column">
        <h3>凤鸣投放币</h3>
        <p><strong>{{ balance.fengmingBalance | priceFormat }}</strong>元</p>
        <router-link v-if="userInfo.allowFmRecharge" :to="{name: 'qwt-charge', query: {mode: 'charge-only'}}"
          @click.native="onClickCharge">
          <el-button type="primary">充值</el-button>
        </router-link>
      </el-col> -->
      <el-col :span="4" class="column">
        <h3>标王投放币</h3>
        <p><strong>{{ balance.biaowangBalance | priceFormat }}</strong>元</p>
        <router-link :to="{name: 'bw-plus-package-list'}">
          <el-button type="primary">管理标王推广</el-button>
        </router-link>
      </el-col>
      <!-- <el-col :span="4" class="column">
        <h3>可用优惠券</h3>
        <p><span class="number">{{coupons.totalElements}}</span>张</p>
        <router-link :to="{name: 'coupon'}"
          @click.native="onClickCoupon">
          <el-button type="primary">查看</el-button>
        </router-link>
      </el-col> -->
      <!-- <el-col :span="16" class="column">
        <el-row class="multi">
          <el-col :span="18">
            <div class="btn">
              <span>广告投放：</span>
              <router-link :to="{name: 'qwt-promotion-list'}"
                @click.native="onClickCampaignList">
                <el-button type="primary">推广管理</el-button>
              </router-link>
            </div>
          </el-col>
        </el-row>
      </el-col> -->
    </el-row>
  </div>
</template>

<script>
import SectionHeader from 'com/common/section-header'
import store from './store'

import track from 'util/track'

export default {
  name: 'account-summary',
  props: ['userInfo'],
  fromMobx: {
    balance: () => store.balance,
    coupons: () => store.coupons
  },
  filters: {
    priceFormat (value) {
      const price = value / 100
      return !isNaN(price) ? (price).toFixed(2) : null
    }
  },
  components: {
    SectionHeader
  },
  methods: {
    onClickCreateCampaign () {
      track({
        action: 'account: click create campaign'
      })
    },
    // onClickMvpCampaignList() {
    //   track({
    //     action: 'account: click query mvp campaigns'
    //   })
    // },
    onClickCampaignList () {
      track({
        action: 'account: click query campaigns'
      })
    },
    onClickCoupon () {
      track({
        action: 'account: click coupon'
      })
    },
    onClickCharge () {
      track({
        action: 'account: click charge'
      })
    }
  },
  async mounted () {
    const { query: { user_id: userId } } = this.$route
    await Promise.all([
      store.getCoupons({ onlyValid: true, status: 0, userId }),
      store.getBalance({ userId })
    ])
  }
}
</script>

<style lang="scss" scoped>
.column {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
}
p {
  margin: 10px 0;
}
.multi {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.btn {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  & > span {
    font-weight: 600;
    color: #6a778c;
  }
}
</style>
