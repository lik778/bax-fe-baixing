
import { createStore } from 'vue-duo'

import {
  switchShowMoreFilters,
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
  status: '',
  adId: ''
}

const store = createStore({
  showMoreFilters: false,

  materials: [],
  ads: [],

  items: [],
  query: {
    ...defaultQuery
  }
})

store.subscribeActions({
  [switchShowMoreFilters]: () => ({
    showMoreFilters: !store.state.showMoreFilters
  }),
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
