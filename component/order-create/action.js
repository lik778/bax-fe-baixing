
import { createAction } from 'vue-duo'

import * as capi from 'api/account'
import * as oapi from 'api/order'
import * as aapi from 'api/ad'

export const createOrder = createAction((order) => {
  return oapi.createOrder(order)
})

export const getAdPrice = createAction((aid, opts) => {
  return aapi.getAdPrice(aid, opts)
})

export const clearAdPrice = createAction()

export const getAds = createAction(() => {
  return aapi.getAds()
})
