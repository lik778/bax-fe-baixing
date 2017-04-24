
import { createStore } from 'vue-duo'

import {
  getMaterials,
  getAdItems
} from './action'

const defaultQuery = {
  offset: 0,
  limit: 20,
  total: 0,

  orderId: ''
}

const store = createStore({
  materials: [],
  items: [],
  query: {
    ...defaultQuery
  }
})

store.subscribeActions({
  [getMaterials]: ({materials = []}) => ({
    materials: [...materials]
  }),
  [getAdItems]: ({items = [], query = {}}) => ({
    items: [...items],
    query: {
      ...defaultQuery,
      ...query
    }
  })
})

export default store
