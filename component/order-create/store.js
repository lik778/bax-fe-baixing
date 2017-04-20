
import { createStore } from 'vue-duo'

import {
  getAds
} from './action'

const store = createStore({
  ads: []
})

store.subscribeActions({
  [getAds]: ({ads = []}) => ({
    ads
  })
})

export default store
