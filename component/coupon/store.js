import { createStore } from 'vue-duo'

import { getValidCoupons, getCoupons, redeemCoupon, getCondition } from './action'

const store = createStore({
  validCoupons: [],
  coupons: [],
  usingConditions: []
})

store.subscribeActions({
  [getValidCoupons]: (validCoupons) => ({
    validCoupons
  }),
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
