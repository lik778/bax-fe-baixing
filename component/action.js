
import { createAction } from 'vue-duo'

import * as aapi from 'api/account'
import * as mapi from 'api/meta'
import track from 'util/track'

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

export const toggleTuoguanVisible = createAction((sideEffect) => {
  if (sideEffect) {
    track({
      ...sideEffect,
      time: Date.now() / 1000 | 0,
      url: window.location.href
    })
  }
})
