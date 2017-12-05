
import { createStore } from 'vue-duo'

import {
  getProductDiscounts,
  getProductPackages,
  getProducts,
  getCoupons,
  redeemCoupon,
  getCondition
} from './action'

const store = createStore({
  allDiscounts: [],
  packages: [],
  products: [],
  coupons: [],
  usingConditions: []
})

store.subscribeActions({
  [getProductDiscounts]: (discounts) => ({
    allDiscounts: [...discounts]
  }),
  [getProductPackages]: (packages) => ({
    packages
  }),
  [getProducts]: (products) => ({
    products
  }),
  [getCoupons]: (coupons) => ({
    coupons
  }),
  [redeemCoupon]: (coupon) => ({
    coupons: [coupon, ...store.state.coupons]
  }),
  [getCondition]: (conditions) => ({
    usingConditions: conditions.usingConditions
  })
})

export default store
