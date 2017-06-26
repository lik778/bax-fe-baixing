
import { createAction } from 'vue-duo'
import * as fapi from 'api/fengming'
import * as oapi from 'api/order'

export const getOrderPayUrl = createAction((oids, summary) => {
  return oapi.getOrderPayUrl(oids, summary)
})

export const getProducts = createAction((type) => {
  return fapi.getProducts(type)
})

export const createOrder = createAction((order) => {
  return fapi.createOrder(order)
})