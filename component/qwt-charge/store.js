
import { createStore } from 'vue-duo'

import {
  getProductDiscounts,
  getProductPackages,
  getProducts,
  getCoupons,
  redeemCoupon,
  getCondition
} from './action'

// const returned = [{
//   created_at: 1511938219,
//   updated_at: 1511938219,
//   startAt: 1511938219,
//   id: 46,
//   template_id: 1,
//   amount: 10000,
//   status: 0,
//   expiredAt: 1543474219,
//   user_id: 88,
//   name: '测试券1',
//   usingConditions: [{
//     type: 101,
//     orderSumOriginalPrice: 100000
//   }, {
//     type: 201,
//     products: [3]
//   }]
// }, {
//   created_at: 1511938219,
//   updated_at: 1511938219,
//   startAt: 1511938219,
//   id: 6,
//   template_id: 1,
//   amount: 20000,
//   status: 0,
//   expiredAt: 1543474219,
//   user_id: 88,
//   name: '测试券2',
//   usingConditions: [{
//     type: 101,
//     orderSumOriginalPrice: 200000
//   }, {
//     type: 201,
//     products: [3]
//   }]
// }, {
//   created_at: 1511938219,
//   updated_at: 1511938219,
//   startAt: 1511938219,
//   id: 7,
//   template_id: 1,
//   amount: 20000,
//   status: 0,
//   expiredAt: 1543474219,
//   user_id: 88,
//   name: '测试券2',
//   usingConditions: [{
//     type: 101,
//     orderSumOriginalPrice: 28800
//   }, {
//     type: 201,
//     products: [3]
//   }]
// }, {
//   created_at: 1511938219,
//   updated_at: 1511938219,
//   startAt: 1511938219,
//   id: 8,
//   template_id: 1,
//   amount: 28800,
//   status: 0,
//   expiredAt: 1543474219,
//   user_id: 88,
//   name: '测试券2',
//   usingConditions: [{
//     type: 101,
//     orderSumOriginalPrice: 28800
//   }, {
//     type: 201,
//     products: [3]
//   }]
// }, {
//   created_at: 1511938219,
//   updated_at: 1511938219,
//   startAt: 1511938219,
//   id: 9,
//   template_id: 1,
//   amount: 60000,
//   status: 0,
//   expiredAt: 1543474219,
//   user_id: 88,
//   name: '测试券2',
//   usingConditions: [{
//     type: 101,
//     orderSumOriginalPrice: 28800
//   }, {
//     type: 201,
//     products: [3]
//   }]
// }
// ]

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
