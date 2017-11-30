<template>
  <div class="my-coupon">
    <topbar :user-info="userInfo" class="topbar">
      <label slot="title">我的优惠券</label>
    </topbar>
    <div class="redeem">
      <el-input class="coupon-code-input" v-model.trim="couponCode" placeholder="输入兑换码"/>
      <el-button type="primary" @click="redeem" :loading="redeemInProgress">兑换</el-button>
    </div>
    <el-tabs v-model="activeCouponTab">
      <el-tab-pane label="优惠券" name="first" class="coupon-pane">
        <coupon
          v-for="coupon in coupons"
          :key="coupon.id"
          :data="displayCoupon(coupon)"
          class="coupon"
          @click="onCouponClick(coupon)" />
      </el-tab-pane>
      <el-tab-pane label="过期优惠券" name="second" class="coupon-pane">
        <coupon
          v-for="coupon in expiredCoupons"
          :key="coupon.id"
          :data="displayCoupon(coupon)"
          class="coupon"
          @click="onCouponClick(coupon)"
          :disabled="true" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Topbar from 'com/topbar'
import Coupon from 'com/common/coupon'

import store from './store'
import { getCoupons, redeemCoupon } from './action'
import { toHumanTime } from 'utils'

export default {
  store,
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      couponCode: '',
      activeCouponTab: 'first',
      redeemInProgress: false
    }
  },
  components: {
    Topbar,
    Coupon
  },
  methods: {
    onCouponClick() {
      this.$router.push({
        name: 'qwt-charge',
        query: {
          mode: 'buy-service'
        }
      })
    },
    async redeem() {
      this.redeemInProgress = true
      const result = await redeemCoupon(this.couponCode)
      if (!result.id) {
        this.$message.error('兑换失败')
      }
      this.redeemInProgress = false
    },
    displayCoupon(coupon, showBtn = true) {
      let priceLimit = coupon.usingConditions.filter(c => c.type === 101)
      if (priceLimit.length) {
        priceLimit = `满${priceLimit[0]['orderSumOriginalPrice'] / 100}元可用`
      } else {
        priceLimit = ''
      }
      let products = coupon.usingConditions.filter(c => c.type === 201)
      if (products.length) {
        products = products[0]['products'].join(',')
      } else {
        products = '任何产品可用'
      }
      const expire = toHumanTime(coupon.startAt, 'YYYY.MM.DD') + '-' + toHumanTime(coupon.expiredAt, 'YYYY.MM.DD')
      const o = {}
      o.money = +(coupon.amount / 100).toFixed(0)
      o.text = priceLimit
      o.title = products
      o.expire = expire
      o.showBtn = showBtn
      return o
    }
  },
  mounted() {
    getCoupons({onlyValid: true})
    getCoupons({onlyValid: false})
  }
}
</script>

<style scoped>
.my-coupon {
  padding: 0 35px;
  width: 100%;
}
.topbar {
  margin-bottom: 20px;
}
.redeem {
  display: flex;
  margin-bottom: 20px;

  &>.coupon-code-input {
    width: 200px;
    margin-right: 10px;
  }
}

.coupon-pane {
  display: flex;
  flex-wrap: wrap;

  &>.coupon {
    width: 300px;
    height: 90px;
    margin-right: 20px;
    margin-bottom: 20px;
  }
}
</style>
