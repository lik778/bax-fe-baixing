import { createStore } from 'vue-duo'

import { getCoupons, redeemCoupon } from './action'

const store = createStore({
  coupons: [],
  expiredCoupons: []
})

store.subscribeActions({
  [getCoupons]: (coupons) => ({
    coupons
  }),
  [redeemCoupon]: (coupon) => {
    if (coupon.id) {
      return {
        coupons: [coupon, ...store.state.coupons]
      }
    } else {
      return {}
    }
  }
})

export default store
