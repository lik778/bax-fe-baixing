
import { createAction } from 'vue-duo'
import * as fapi from 'api/fengming'
import * as mapi from 'api/meta'

export const getHomepageSummary = createAction(() => {
  return fapi.getHomepageSummary()
})

export const getCoupons = createAction((opt) => {
  return mapi.getCoupons(opt)
})
