
import { createAction } from 'vue-duo'

import * as aapi from 'api/account'
import * as mapi from 'api/meta'

export const getCurrentUser = createAction(() => {
  return aapi.getCurrentUser()
})

export const getCategories = createAction(() => {
  return mapi.getCategories()
})

export const getAreas = createAction(() => {
  return mapi.getAreas()
})

export const getRoles = createAction(() => {
  return aapi.getRoles()
})
