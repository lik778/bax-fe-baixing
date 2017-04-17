
import { createAction } from 'vue-duo'
import * as mapi from 'api/material'

export const getMaterials = createAction((opts) => {
  return mapi.getMaterials(opts)
})
