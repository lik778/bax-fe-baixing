
import { createStore } from 'vue-duo'

import {
  getUsers
} from './action'

const store = createStore({
  users: [],
  total: 0
})

store.subscribeActions({
  [getUsers]: ({users = []}) => ({
    users
  })
})

export default store
