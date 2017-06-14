
import { createStore } from 'vue-duo'

import {
  switchShowMoreFilters
} from './action'

const store = createStore({
  showMoreFilters: false
})

store.subscribeActions({
  [switchShowMoreFilters]: () => ({
    showMoreFilters: !store.state.showMoreFilters
  })
})

export default store
