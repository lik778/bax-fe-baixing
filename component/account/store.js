import { createStore } from 'vue-duo'

import { getLogs, getSummary, getCoupons } from './action'

const store = createStore({
  logQuery: {},
  logs: [],

  summary: {},
  coupons: []
})

store.subscribeActions({
  [getLogs]: ({logs = [], query = {}}) => ({
    logQuery: query,
    logs
  }),
  [getSummary]: summary => ({
    summary
  }),
  [getCoupons]: (coupons) => ({
    coupons
  })
})

export default store
