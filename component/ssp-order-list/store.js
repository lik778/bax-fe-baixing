
import { createStore } from 'vue-duo'

import {
  switchShowMoreFilters,
  getOrders
} from './action'

const defaultQuery = {
  offset: 0,
  limit: 20,
  total: 0,

  createdAtFrom: '',
  createdAtTo: '',
  timeRange: '',
  orderId: '',
  status: '',
  userId: ''
}

const store = createStore({
  showMoreFilters: false,

  orders: [],
  query: {
    ...defaultQuery
  },

  ads: []
})

store.subscribeActions({
  [switchShowMoreFilters]: () => ({
    showMoreFilters: !store.state.showMoreFilters
  }),
  [getOrders]: ({orders = [], query = {}}) => ({
    orders,
    query: {
      ...defaultQuery,
      ...query
    }
  })
})

export default store
