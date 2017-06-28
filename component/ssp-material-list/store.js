
import { createStore } from 'vue-duo'

import {
  getMaterials
} from './action'

const defaultQuery = {
  offset: 0,
  limit: 20,
  total: 0,

  createdAtFrom: '',
  createdAtTo: '',
  userId: '',
  name: '',
  slot: ''
}

const store = createStore({
  materials: [],
  query: {...defaultQuery}
})

store.subscribeActions({
  [getMaterials]: ({materials = [], query = {}}) => ({
    materials,
    query: {
      ...defaultQuery,
      ...query
    }
  })
})

export default store
