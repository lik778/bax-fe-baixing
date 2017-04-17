
import { createAction } from 'vue-duo'

import * as oapi from 'api/order'
import * as aapi from 'api/ad'

export const getOrders = createAction((opts) => {
  return oapi.getOrders(opts)
})

export const createOrder = createAction((order) => {
  return oapi.createOrder(order)
})

export const payOrder = createAction((oid) => {
  return oapi.payOrder(oid)
})

export const getAds = createAction(() => {
  return aapi.getAds()
})
