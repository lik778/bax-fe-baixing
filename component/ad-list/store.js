
import { createStore } from 'vue-duo'

import {
  getMaterials,
  getAdItems
} from './action'

const store = createStore({
  materials: [],
  items: [],
  offset: 0,
  limit: 20,
  total: 0
})

store.subscribeActions({
  [getMaterials]: ({materials = []}) => ({
    materials: [...materials]
  }),
  [getAdItems]: ({items = [], offset, total, limit}) => ({
    items: [...items],
    offset,
    limit,
    total
  })
})

export default store
