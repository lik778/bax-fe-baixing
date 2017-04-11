
import * as oapi from 'api/order'
import { createAction } from 'vue-duo'

export const getOrders = createAction((opts) => {
  return oapi.getOrders(opts)
})
