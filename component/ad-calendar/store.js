
import { createStore } from 'vue-duo'

import {
  getCalendar,
  getAds
} from './action'

const store = createStore({
  calendar: {},
  ads: []
})

store.subscribeActions({
  [getCalendar]: () => ({

  }),
  [getAds]: ({ads = []}) => ({
    ads
  })
})

export default store
