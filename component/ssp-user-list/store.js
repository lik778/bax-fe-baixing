
import { createStore } from 'vue-duo'

import {
  getUsers
} from './action'

const defaultQuery = {
  offset: 0,
  limit: 20,
  total: 0,

  userId: '',
  roles: '', // '1,3,7'
  name: ''
}

const store = createStore({
  users: [],
  query: {
    ...defaultQuery
  }
})

store.subscribeActions({
  [getUsers]: ({users = [], query = {}}) => ({
    users,
    query: {
      ...defaultQuery,
      ...query
    }
  })
})

export default store