
import { createStore } from 'vue-duo'

import {
  getMaterials,
  getAdGroups
} from './action'

const store = createStore({
  materials: [],
  groups: [],
  offset: 0,
  limit: 20,
  total: 0
})

store.subscribeActions({
  [getMaterials]: ({materials = []}) => ({
    materials: [...materials]
  }),
  [getAdGroups]: ({groups = [], offset, total, limit}) => ({
    groups: [...groups],
    offset,
    limit,
    total
  })
})

export default store
