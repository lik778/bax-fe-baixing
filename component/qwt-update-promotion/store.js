
import { createStore } from 'vue-duo'

import {
  mergeKeywords
} from 'util/campaign'

import {
  getRecommendedWords,
  getCurrentBalance,
  getCreativeWords,
  clearStore
} from './action'

const store = createStore({
  recommendedWords: [],
  creativeWords: [],
  currentBalance: 0
})

store.subscribeActions({
  [getRecommendedWords]: (words) => ({
    recommendedWords: mergeKeywords(store.state.recommendedWords, words)
  }),
  [getCreativeWords]: (words) => ({
    creativeWords: [...words]
  }),
  [getCurrentBalance]: (balance) => ({
    currentBalance: balance
  }),
  [clearStore]: () => ({
    recommendedWords: [],
    creativeWords: []
  })
})

export default store
