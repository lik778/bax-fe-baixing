
import { createStore } from 'vue-duo'

import {
  getUsers
} from './action'

const store = createStore({
  users: [],
  offset: 0,
  limit: 20,
  total: 0
})

store.subscribeActions({
  [getUsers]: ({users = [], offset, total, limit}) => ({
    offset,
    total,
    limit,
    users
  })
})

export default store
