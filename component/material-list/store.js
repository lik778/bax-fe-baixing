
import { createStore } from 'vue-duo'

import {
  getMaterials
} from './action'

const store = createStore({
  materials: [],
  offset: 0,
  limit: 20,
  total: 0
})

store.subscribeActions({
  [getMaterials]: ({materials = [], offset, limit, total}) => ({
    materials,
    offset,
    limit,
    total
  })
})

export default store
