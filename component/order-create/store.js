
import { createStore } from 'vue-duo'

import {
  clearAdPrice,
  getAdPrice,
  getUsers,
  getAds
} from './action'

const store = createStore({
  adPrice: {},
  ads: [],
  // 用于筛选项
  customers: [],
  sales: []
})

store.subscribeActions({
  [clearAdPrice]: () => ({
    adPrice: {}
  }),
  [getAdPrice]: (price) => ({
    adPrice: {...price}
  }),
  [getUsers]: ({users = [], type}) => {
    if (type === 'all') {
      return {
        customers: [...users],
        sales: [...users]
      }
    }

    if (type === 'sales') {
      return {
        sales: [...users]
      }
    }

    if (type === 'customer') {
      return {
        customers: [...users]
      }
    }
  },
  [getAds]: ({ads = []}) => ({
    ads
  })
})

export default store
