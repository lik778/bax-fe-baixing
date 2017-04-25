
import { createAction } from 'vue-duo'

import * as oapi from 'api/order'

export const changeOrderDiscount = createAction((id, data) => {
  return oapi.changeOrderDiscount(id, data)
})

export const getOrderInfo = createAction((id) => {
  return oapi.getOrderInfo(id)
})

export const getOrderLogs = createAction((id) => {
  return oapi.getOrderLogs(id)
})
