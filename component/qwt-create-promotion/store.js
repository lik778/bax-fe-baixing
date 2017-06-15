
import { createStore } from 'vue-duo'

import {
  getRecommendedWords,
  getCreativeWords,
  clearStore
} from './action'

const store = createStore({
  recommendedWords: [],
  creativeWords: []
})

store.subscribeActions({
  [getRecommendedWords]: (words) => ({
    recommendedWords: [...words]
  }),
  [getCreativeWords]: (words) => ({
    creativeWords: [...words]
  }),
  [clearStore]: () => ({
    recommendedWords: [],
    creativeWords: []
  })
})

export default store
