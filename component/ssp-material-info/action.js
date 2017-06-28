
import { createAction } from 'vue-duo'
import * as mapi from 'api/material'

export const getMaterial = createAction((id) => {
  return mapi.getMaterial(id)
})
