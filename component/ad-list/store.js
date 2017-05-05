
import { createStore } from 'vue-duo'

import {
  getMaterials,
  getAdItems,
  getAds
} from './action'

const defaultQuery = {
  offset: 0,
  limit: 20,
  total: 0,

  timeRange: '', // xxx,ooo
  customerId: '',
  orderId: '',
  adId: ''
}

const store = createStore({
  materials: [],
  ads: [],

  items: [],
  query: {
    ...defaultQuery
  }
})

store.subscribeActions({
  [getMaterials]: ({materials = []}) => ({
    materials: [...materials]
  }),
  [getAdItems]: ({items = [], query = {}}) => ({
    items: [...items],
    query: {
      ...defaultQuery,
      ...query
    }
  }),
  [getAds]: ({ads = []}) => ({
    ads: [...ads]
  })
})

export default store
