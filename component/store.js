
import { createStore } from 'vue-duo'

import {
  getCurrentUser
} from './action'

const store = createStore({
  currentUser: {}
})

store.subscribeActions({
  [getCurrentUser]: (user) => ({
    currentUser: {...user}
  })
})

export default store
