
import { createAction } from 'vue-duo'
import * as fapi from 'api/fengming'
import * as aapi from 'api/account'
import * as oapi from 'api/order'
import * as mapi from 'api/meta'

export const getUserIdFromBxSalesId = createAction((salesId) => {
  return aapi.getUserIdFromBxSalesId(salesId)
})
// TODO - queryUserInfo, getUserInfo 嘟嘟噜的锅
export const queryUserInfo = createAction((uid) => {
  return aapi.queryUserInfo(uid)
})

export const getUserInfo = createAction((uid) => {
  return aapi.getUserInfo(uid)
})

export const getProductDiscounts = createAction((types) => {
  return mapi.getProductDiscounts(types)
})

export const getProductPackages = createAction(() => {
  return fapi.getProductPackages()
})

export const getProducts = createAction((type) => {
  return fapi.getProducts(type)
})

export const createOrder = createAction((order) => {
  return fapi.createOrder(order)
})

export const getOrderPayUrl = createAction((oids, summary) => {
  return oapi.getOrderPayUrl(oids, summary)
})

export const payOrders = createAction((oids) => {
  return oapi.payOrders(oids)
})

export const getCoupons = createAction((opt) => {
  return mapi.getCoupons(opt)
})

export const redeemCoupon = createAction((code) => {
  return mapi.redeemCoupon(code)
})

export const getCondition = createAction(() => {
  return mapi.getCondition()
})
