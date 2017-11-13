
import { createStore } from 'vue-duo'

import {
  getCsvDownloadUrl,
  clearStatistics,
  getReport
} from './action'

const store = createStore({
  csvDownloadUrl: '',
  statistics: [],
  total: 0
})

store.subscribeActions({
  [clearStatistics]: () => ({
    statistics: []
  }),
  [getCsvDownloadUrl]: (url) => ({
    csvDownloadUrl: url
  }),
  [getReport]: ({rows, total}) => ({
    statistics: rows,
    total
  })
})

export default store
