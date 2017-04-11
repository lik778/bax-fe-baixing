
import { createStore } from 'vue-duo'

import {
  getOrders
} from './action'

const store = createStore({
  orders: [],
  total: 0
})

store.subscribeActions({
  [getOrders]: ({orders = []}) => ({
    orders
  })
})

export default store
