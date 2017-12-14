
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
  limit: 100,
  offset: 0,
  total: 0
})

store.subscribeActions({
  [clearStatistics]: () => ({
    statistics: []
  }),
  [getCsvDownloadUrl]: (url) => ({
    csvDownloadUrl: url
  }),
  [getReport]: ({rows, total, offset, summary}) => ({
    statistics: rows,
    summary,
    offset,
    total
  })
})

export default store
