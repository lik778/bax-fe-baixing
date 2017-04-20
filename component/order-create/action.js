
import { createAction } from 'vue-duo'

import * as oapi from 'api/order'
import * as aapi from 'api/ad'

export const createOrder = createAction((order) => {
  return oapi.createOrder(order)
})

export const getAds = createAction(() => {
  return aapi.getAds()
})
