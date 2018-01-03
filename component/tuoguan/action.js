
import { createAction } from 'vue-duo'

import * as fapi from 'api/fengming'

export const getTuoguanStatus = createAction(() => {
  return fapi.getTuoguanStatus()
})
