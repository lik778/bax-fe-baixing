import { createAction } from 'vue-duo'
import * as mapi from 'api/meta'

export const getCoupons = createAction((opt) => {
  return mapi.getCoupons(opt)
})

export const redeemCoupon = createAction((code) => {
  return mapi.redeemCoupon(code)
})
