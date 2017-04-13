
import { createStore } from 'vue-duo'

import {
  getOrders,
  getAds
} from './action'

const store = createStore({
  orders: [],
  total: 0,
  ads: []
})

store.subscribeActions({
  [getOrders]: ({orders = []}) => ({
    orders
  }),
  [getAds]: ({ads = []}) => ({
    ads
  })
})

export default store
