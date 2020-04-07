<template>
  <div class="my-coupon">
    <main>
      <el-tabs v-model="activeCouponTab">
        <el-tab-pane label="有效优惠券" name="first">
          <div class="coupon-list">
            <coupon
              v-for="coupon in coupons"
              :key="coupon.id"
              :coupon="coupon"
              class="coupon"
              @click="onCouponClick(coupon)"
            />
            <p v-if="coupons.length === 0">暂无有效优惠券</p>
          </div>
        </el-tab-pane>
      </el-tabs>
      <hr />
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
    </main>
  </div>
</template>

<script>
import Coupon from './coupon'
import { getCoupons } from 'api/meta'

export default {
  name: 'qwt-coupon',
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  components: {
    Coupon
  },
  data() {
    return {
      activeCouponTab: 'first',
      coupons: []
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
    }
  },
  async mounted() {
    const {data: coupons} = await getCoupons({status: 0, limit: 100})
    this.coupons = coupons
  }
}
</script>

<style lang="postcss" scoped>
.my-coupon {
  & > main {
    background-color: #fff;
    padding: 25px;
    border-radius: 4px;
    box-shadow: 0 2px 9px 0 rgba(83, 95, 127, .10);
  }
}

.coupon-list {
  display: flex;
  flex-wrap: wrap;

  & > .coupon {
    width: 300px;
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
