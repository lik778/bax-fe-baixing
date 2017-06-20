
import { createAction } from 'vue-duo'
import * as fapi from 'api/fengming'

export const createOrder = createAction((order) => {
  return fapi.createOrder(order)
})
