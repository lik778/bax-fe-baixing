import { createStore } from 'vue-duo'

import { getHomepageSummary, getCoupons } from './action'

const store = createStore({
  summary: {},
  coupons: []
})

store.subscribeActions({
  [getHomepageSummary]: summary => ({ summary }),
  [getCoupons]: (coupons) => ({
    coupons
  })
})

export default store
