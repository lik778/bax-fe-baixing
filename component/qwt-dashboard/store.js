
import { createStore } from 'vue-duo'

import {
  getStatistics
} from './action'

const store = createStore({
  statistics: []
})

store.subscribeActions({
  [getStatistics]: (statistics = []) => ({
    statistics
  })
})

export default store
