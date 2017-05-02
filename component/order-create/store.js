
import { createStore } from 'vue-duo'

import {
  clearAdPrice,
  getAdPrice,
  getAds
} from './action'

const store = createStore({
  adPrice: {},
  ads: []
})

store.subscribeActions({
  [clearAdPrice]: () => ({
    adPrice: {}
  }),
  [getAdPrice]: (price) => ({
    adPrice: {...price}
  }),
  [getAds]: ({ads = []}) => ({
    ads
  })
})

export default store
