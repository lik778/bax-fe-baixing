import { createStore } from 'vue-duo'

import { getHomepageSummary } from './action'

const store = createStore({
  summary: {}
})

store.subscribeActions({
  [getHomepageSummary]: summary => ({ summary })
})

export default store
