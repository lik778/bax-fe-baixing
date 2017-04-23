
import { createStore } from 'vue-duo'

import {
  getMaterials
} from './action'

const store = createStore({
  materials: [],
  query: {
    offset: 0,
    limit: 20,
    total: 0,

    name: ''
  }
})

store.subscribeActions({
  [getMaterials]: ({materials = [], query = {}}) => ({
    materials,
    query
  })
})

export default store
