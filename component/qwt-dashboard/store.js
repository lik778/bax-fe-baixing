
import { createStore } from 'vue-duo'

import {
  getCsvDownloadUrl,
  clearStatistics,
} from './action'

const store = createStore({
  csvDownloadUrl: '',
  statistics: []
})

store.subscribeActions({
  [clearStatistics]: () => ({
    statistics: []
  }),
  [getCsvDownloadUrl]: (url) => ({
    csvDownloadUrl: url
  })
})

export default store
