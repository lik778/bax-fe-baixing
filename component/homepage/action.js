import { createAction } from 'vue-duo'
import * as fapi from 'api/fengming'

export const getHomepageSummary = createAction(() => {
  return fapi.getHomepageSummary()
})
