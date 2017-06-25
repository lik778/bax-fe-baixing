import { createStore } from 'vue-duo'

import { getLogs, getSummary } from './action'

const store = createStore({
  logs: {
    logs: [],
    query: {}
  },
  summary: {}
})

store.subscribeActions({
  [getLogs]: logs => ({ logs }),
  [getSummary]: summary => ({ summary })
})

export default store
