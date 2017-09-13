
import { createAction } from 'vue-duo'
import * as fapi from 'api/fengming'

/**
 * opts: { type, time, offset, pageSize }
 */
export const getLogs = createAction((opts) => {
  return fapi.getLogs(opts)
})

export const getSummary = createAction(() => {
  return fapi.getSummary()
})
