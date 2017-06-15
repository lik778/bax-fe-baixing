
import { createStore } from 'vue-duo'

import {
  switchShowMoreFilters,
  getCurrentCampaigns
} from './action'

const store = createStore({
  showMoreFilters: false,
  currentPromotions: []
})

store.subscribeActions({
  [switchShowMoreFilters]: () => ({
    showMoreFilters: !store.state.showMoreFilters
  }),
  [getCurrentCampaigns]: (promotions) => ({
    currentPromotions: [...promotions]
  })
})

export default store
