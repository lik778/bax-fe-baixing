
import { createStore } from 'vue-duo'

import {
  getRecommendedWords,
  getCreativeWords
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
  })
})

export default store
