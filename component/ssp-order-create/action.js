
import { createAction } from 'vue-duo'

import * as oapi from 'api/order'
import * as aapi from 'api/ad'

export const createOrder = createAction((order) => {
  return oapi.createOrder(order)
})

export const getCalendar = createAction((opts) => {
  return oapi.getCalendar(opts)
})

export const setCalendarOptions = createAction()

export const getAdPrice = createAction((aid, opts) => {
  return aapi.getAdPrice(aid, opts)
})

export const getAds = createAction(() => {
  return aapi.getAds()
})

export const clearStore = createAction()
