
import { createStore } from 'vue-duo'

import {
  getRecommendedWords,
  getCurrentBalance,
  getCreativeWords,
  clearStore
} from './action'

const store = createStore({
})

store.subscribeActions({
})

export default store
