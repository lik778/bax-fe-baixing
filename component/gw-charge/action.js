
import { createAction } from 'vue-duo'
import * as fapi from 'api/fengming'
import * as aapi from 'api/account'
import * as oapi from 'api/order'

export const getUserIdFromBxSalesId = createAction((salesId) => {
  return aapi.getUserIdFromBxSalesId(salesId)
})

export const getOrderPayUrl = createAction((oids, summary) => {
  return oapi.getOrderPayUrl(oids, summary)
})

export const getUserInfo = createAction((uid) => {
  return aapi.getUserInfo(uid)
})

export const getProducts = createAction((type) => {
  return fapi.getProducts(type)
})

export const createOrder = createAction((order) => {
  return fapi.createOrder(order)
})

export const payOrders = createAction((oids) => {
  return oapi.payOrders(oids)
})
