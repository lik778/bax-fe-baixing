
import { createAction } from 'vue-duo'
import * as fapi from 'api/fengming'

export const getStatistics = createAction((opts) => {
  return fapi.getStatistics(opts)
})
