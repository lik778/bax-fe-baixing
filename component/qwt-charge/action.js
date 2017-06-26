
import { createAction } from 'vue-duo'
import * as fapi from 'api/fengming'
import * as oapi from 'api/order'

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
