
import { createAction } from 'vue-duo'

import * as aapi from 'api/account'

export const getCurrentUser = createAction(() => {
  return aapi.getCurrentUser()
})
