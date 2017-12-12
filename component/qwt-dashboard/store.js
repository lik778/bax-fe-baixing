
import { createStore } from 'vue-duo'

import {
  getCsvDownloadUrl,
  clearStatistics,
  getReport
} from './action'

const store = createStore({
  csvDownloadUrl: '',
  statistics: [],
  summary: {},
  offset: 0,
  limit: 20,
  total: 0
})

store.subscribeActions({
  [clearStatistics]: () => ({
    statistics: []
  }),
  [getCsvDownloadUrl]: (url) => ({
    csvDownloadUrl: url
  }),
  [getReport]: ({rows, total, limit, offset, summary}) => ({
    statistics: rows,
    summary,
    total
  })
})

export default store
