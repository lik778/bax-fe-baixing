
import { createStore } from 'vue-duo'

import {
  getCsvDownloadUrl,
  getStatistics
} from './action'

const store = createStore({
  csvDownloadUrl: '',
  statistics: []
})

store.subscribeActions({
  [getStatistics]: (statistics = []) => ({
    statistics
  }),
  [getCsvDownloadUrl]: (url) => ({
    csvDownloadUrl: url
  })
})

export default store
