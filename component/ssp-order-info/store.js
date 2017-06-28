
import { createStore } from 'vue-duo'

import {
  getOrderInfo,
  getOrderLogs
} from './action'

const store = createStore({
  orderInfo: {
    order: {}
  },
  logs: []
})

store.subscribeActions({
  [getOrderInfo]: (info) => ({
    orderInfo: {...info}
  }),
  [getOrderLogs]: (logs) => ({
    logs
  })
})

export default store
