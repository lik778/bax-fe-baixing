
import { createStore } from 'vue-duo'

import {
  switchShowMoreFilters,
  getCurrentCampaigns
} from './action'

const defaultQuery = {
  offset: 0,
  limit: 20,
  total: 0
}

const store = createStore({
  showMoreFilters: false,

  promotions: [],
  query: {
    ...defaultQuery
  }
})

store.subscribeActions({
  [switchShowMoreFilters]: () => ({
    showMoreFilters: !store.state.showMoreFilters
  }),
  [getCurrentCampaigns]: ({promotions = [], query}) => ({
    promotions,
    query: {
      ...defaultQuery,
      ...query
    }
  })
})

export default store
