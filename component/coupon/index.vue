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
      <el-tab-pane label="有效优惠券" name="first">
        <div class="coupon-list">
          <coupon
            v-for="coupon in validCoupons"
            :key="coupon.id"
            :coupon="displayCoupon(coupon)"
            class="coupon"
            :showBtn="true"
            @click="onCouponClick(coupon)" />
            <p v-if="validCoupons.length === 0">暂无有效优惠券</p>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已过期或未生效" name="second">
        <div class="coupon-list">
          <coupon
            v-for="coupon in invalidCoupons"
            :key="coupon.id"
            :coupon="displayCoupon(coupon)"
            class="coupon"
            @click="onCouponClick(coupon)"
            :disabled="true" />
            <p v-if="invalidCoupons.length === 0">暂无已过期或未生效优惠券</p>
        </div>
      </el-tab-pane>
    </el-tabs>
    <footer>
      <h4>优惠券使用说明</h4>
      <ol>
        <li>1.本券可在适用范围内购买付费产品时，抵扣对应金额的费用。</li>
        <li>2.本券不能兑换现金，不找零。</li>
        <li>3.发生退款时，现金券不退还。</li>
        <li>4.请在到期时间前使用，券过期不补。</li>
        <li>5.一次购买可使用张数以优惠券面提示为准。</li>
        <li>6.使用规则最终解释权归百姓网所有。</li>
      </ol>
    </footer>
  </div>
</template>

<script>
import Topbar from 'com/topbar'
import Coupon from 'com/common/coupon'

import { getCoupons, getValidCoupons, redeemCoupon, getCondition } from './action'
import store from './store'
import { displayCoupon } from 'util/meta'

export default {
  store,
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  components: {
    Topbar,
    Coupon
  },
  data() {
    return {
      couponCode: '',
      activeCouponTab: 'first',
      redeemInProgress: false
    }
  },
  computed: {
    invalidCoupons() {
      const seconds = Math.floor(Date.now() / 1000)
      return this.coupons.filter(coupon => {
        if (coupon.status !== 0) {
          return true
        }
        if (seconds < coupon.startAt) {
          return true
        }
        if (coupon.expiredAt < seconds) {
          return true
        }
        return false
      })
    }
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
      if (result === 0) {
        this.redeemInProgress = false
        return this.$message.error('兑换失败')
      }
      this.$message.success('兑换成功')
      this.redeemInProgress = false
      await getValidCoupons()
    },
    displayCoupon
  },
  async mounted() {
    await getCondition()
    await getValidCoupons()
  },
  watch: {
    async activeCouponTab(v) {
      if (v === 'first') {
        await getValidCoupons()
      } else if (v === 'second') {
        await getCoupons()
      }
    }
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

.coupon-list {
  display: flex;
  flex-wrap: wrap;

  &>.coupon {
    width: 300px;
    min-height: 90px;
    margin-right: 20px;
    margin-bottom: 20px;
  }
}

hr {
  border-top: 1px solid rgb(209, 219, 229);
}
footer {
  margin: 30px 0;
  font-size: 13px;
  line-height: 1.62;
  color: #6a778c;
}
</style>
