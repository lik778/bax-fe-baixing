
import { createStore } from 'vue-duo'

import {
  getOrders
} from './action'

const defaultQuery = {
  offset: 0,
  limit: 20,
  total: 0
}

const store = createStore({
  orders: [],
  query: {
    ...defaultQuery
  },

  ads: []
})

store.subscribeActions({
  [getOrders]: ({orders = [], query = {}}) => ({
    orders,
    query: {
      ...defaultQuery,
      ...query
    }
  })
})

export default store
