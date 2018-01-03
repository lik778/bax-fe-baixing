
import { createStore } from 'vue-duo'

import {
  getTuoguanStatus
} from './action'

const store = createStore({
  status: {}
})

store.subscribeActions({
  [getTuoguanStatus]: (status) => ({ status })
})

export default store
