
import { createAction } from 'vue-duo'

import * as mapi from 'api/material'
import * as aapi from 'api/ad'

export const switchShowMoreFilters = createAction()

export const getAds = createAction(() => {
  return aapi.getAds()
})

export const createAdItem = createAction((item) => {
  return aapi.createAdItem(item)
})

export const continueAdItem = createAction((id, opts) => {
  return aapi.continueAdItem(id, opts)
})

export const pauseAdItem = createAction((id, opts) => {
  return aapi.pauseAdItem(id, opts)
})

export const getMaterials = createAction((opts) => {
  return mapi.getMaterials(opts)
})

export const getAdItems = createAction((opts) => {
  return aapi.getAdItems(opts)
})

export const setAdItemMaterial = createAction((itemId, materialId) => {
  return aapi.setAdItemMaterial(itemId, materialId)
})

export const addAdItemMaterial = createAction((itemId, material) => {
  return aapi.addAdItemMaterial(itemId, material)
})

export const verifyAdItem = createAction((id, status, opts) => {
  return aapi.verifyAdItem(id, status, opts)
})