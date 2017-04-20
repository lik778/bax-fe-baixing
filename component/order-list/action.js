
import { createAction } from 'vue-duo'

import * as oapi from 'api/order'

export const getOrders = createAction((opts) => {
  return oapi.getOrders(opts)
})

export const payOrder = createAction((oid) => {
  return oapi.payOrder(oid)
})
