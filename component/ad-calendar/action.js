
import { createAction } from 'vue-duo'

import * as oapi from 'api/order'
import * as aapi from 'api/ad'

export const getCalendar = createAction((opts) => {
  return oapi.getCalendar(opts)
})

export const getAds = createAction(() => {
  return aapi.getAds()
})
