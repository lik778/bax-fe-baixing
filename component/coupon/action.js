import { createAction } from 'vue-duo'
import * as mapi from 'api/meta'

export const getValidCoupons = createAction(() => {
  return mapi.getCoupons({ onlyValid: true, status: 0 })
})

export const getCoupons = createAction(() => {
  return mapi.getCoupons()
})

export const redeemCoupon = createAction((code) => {
  return mapi.redeemCoupon(code)
})

export const getCondition = createAction(() => {
  return mapi.getCondition()
})
