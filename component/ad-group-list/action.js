
import { createAction } from 'vue-duo'

import * as mapi from 'api/material'
import * as aapi from 'api/ad'

export const getMaterials = createAction((opts) => {
  return mapi.getMaterials(opts)
})

export const getAdGroups = createAction((type, opts) => {
  return aapi.getAdGroups(type, opts)
})

export const transferAdItems = createAction((data) => {
  return aapi.transferGroupItems(data)
})

export const createAdGroup = createAction((group) => {
  return aapi.createAdGroup(group)
})

export const setAdGroupMaterial = createAction((gid, mid) => {
  return aapi.setAdGroupMaterial(gid, mid)
})

export const addAdGroupMaterial = createAction((gid, material) => {
  return aapi.addAdGroupMaterial(gid, material)
})

export const verifyAdGroup = createAction((id, status) => {
  return aapi.verifyAdGroup(id, status)
})

export const verifyAdItem = createAction((id, status) => {
  return aapi.verifyAdItem(id, status)
})
