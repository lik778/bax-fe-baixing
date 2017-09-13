import { createStore } from 'vue-duo'

import { getLogs, getSummary } from './action'

const store = createStore({
  logQuery: {},
  logs: [],

  summary: {}
})

store.subscribeActions({
  [getLogs]: ({logs = [], query = {}}) => ({
    logQuery: query,
    logs
  }),
  [getSummary]: summary => ({
    summary
  })
})

export default store
