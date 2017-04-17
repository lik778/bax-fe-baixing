
import { createAction } from 'vue-duo'

import * as aapi from 'api/ad'

export const getAdGroups = createAction((type, opts) => {
  return aapi.getAdGroups(type, opts)
})

export const transferAdItems = createAction((data) => {
  return aapi.transferGroupItems(data)
})

export const createAdGroup = createAction((group) => {
  return aapi.createAdGroup(group)
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
