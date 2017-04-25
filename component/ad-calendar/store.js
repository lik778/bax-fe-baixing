
import { createStore } from 'vue-duo'

import {
  queryCalendar
} from './action'

const store = createStore({
  calendar: {}
})

store.subscribeActions({
  [queryCalendar]: () => ({

  })
})

export default store
