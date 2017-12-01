
import { createAction } from 'vue-duo'
import * as fapi from 'api/fengming'
import * as mapi from 'api/meta'

/**
 * opts: { type, time, offset, pageSize }
 */
export const getLogs = createAction((opts) => {
  return fapi.getLogs(opts)
})

export const getSummary = createAction(() => {
  return fapi.getSummary()
})

export const getCoupons = createAction((opt) => {
  return mapi.getCoupons(opt)
})
