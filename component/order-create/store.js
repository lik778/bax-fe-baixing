
import { createStore } from 'vue-duo'

import {
  clearAdPrice,
  getAdPrice,
  getUsers,
  getAds
} from './action'

const store = createStore({
  adPrice: {},
  users: [],
  ads: []
})

store.subscribeActions({
  [clearAdPrice]: () => ({
    adPrice: {}
  }),
  [getAdPrice]: (price) => ({
    adPrice: {...price}
  }),
  [getUsers]: ({users}) => ({
    users
  }),
  [getAds]: ({ads = []}) => ({
    ads
  })
})

export default store
