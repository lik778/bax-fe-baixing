
import { createAction } from 'vue-duo'

import * as aapi from 'api/ad'

export const getAdGroups = createAction((type, opts) => {
  return aapi.getAdGroups(type, opts)
})
