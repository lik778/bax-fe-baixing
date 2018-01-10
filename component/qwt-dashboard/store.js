
import { createStore } from 'vue-duo'

import {
  clearStatistics,
  getReport
} from './action'

const store = createStore({
  statistics: [],
  summary: {},
  limit: 100,
  offset: 0,
  total: 0
})

store.subscribeActions({
  [clearStatistics]: () => ({
    statistics: []
  }),
  [getReport]: ({rows, total, offset, summary}) => ({
    statistics: rows,
    summary,
    offset,
    total
  })
})

export default store
