
import { createAction } from 'vue-duo'
import * as mapi from 'api/material'

export const getMaterials = createAction(() => {
  return mapi.getMaterials()
})
