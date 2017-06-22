
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

  campaigns: [],
  query: {
    ...defaultQuery
  }
})

store.subscribeActions({
  [switchShowMoreFilters]: () => ({
    showMoreFilters: !store.state.showMoreFilters
  }),
  [getCurrentCampaigns]: ({campaigns = [], query}) => ({
    campaigns,
    query: {
      ...defaultQuery,
      ...query
    }
  })
})

export default store
