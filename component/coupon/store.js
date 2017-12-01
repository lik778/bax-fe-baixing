import { createStore } from 'vue-duo'

import { getCoupons, redeemCoupon, getCondition } from './action'

const store = createStore({
  coupons: [],
  expiredCoupons: [],
  usingConditions: []
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
  },
  [getCondition]: (conditions) => ({
    usingConditions: conditions.usingConditions
  })
})

export default store
