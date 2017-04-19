
import { createStore } from 'vue-duo'

import {
  getOrders,
  getAds
} from './action'

const store = createStore({
  orders: [],
  offset: 0,
  limit: 20,
  total: 0,

  ads: []
})

store.subscribeActions({
  [getOrders]: ({orders = [], offset, total, limit}) => ({
    orders,
    offset,
    total,
    limit
  }),
  [getAds]: ({ads = []}) => ({
    ads
  })
})

export default store
