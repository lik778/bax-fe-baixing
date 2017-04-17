
import { createStore } from 'vue-duo'

import {
  getOrderInfo
} from './action'

const store = createStore({
  orderInfo: {
    order: {}
  }
})

store.subscribeActions({
  [getOrderInfo]: (info) => ({
    orderInfo: {...info}
  })
})

export default store
