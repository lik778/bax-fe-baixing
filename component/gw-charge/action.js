
import { createAction } from 'vue-duo'
import * as fapi from 'api/fengming'

export const getProducts = createAction((type) => {
  return fapi.getProducts(type)
})

export const createOrder = createAction((order) => {
  return fapi.createOrder(order)
})
