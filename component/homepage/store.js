import { createStore } from 'vue-duo'

import { getHomepageSummary, getCoupons } from './action'

const store = createStore({
  summary: {
    campaignCount: 0,
    balance: 0
  },
  coupons: []
})

store.subscribeActions({
  [getHomepageSummary]: summary => ({ summary }),
  [getCoupons]: (coupons) => ({
    coupons
  })
})

export default store
