import { createAction } from 'vue-duo'
import * as dapi from 'api/dashboard'

export const summaryOfProduct = createAction((range) => {
  return Promise.all([
    dapi.getProfitByProduct(), // yesterday
    dapi.getProfitByProduct(range),
    dapi.getTarget(range)
    ])
})

export const setTarget = createAction((range, product, value) => {
  return dapi.setTarget(range, product, value)
})

export const getTarget = createAction((range) => {
  return dapi.getTarget(range)
})