
import { observable, action, toJS } from 'mobx'
import * as aapi from 'api/account'

const defaultQuery = {
  offset: 0,
  limit: 20,
  total: 0,

  userId: '',
  roles: '', // '1,3,7'
  name: ''
}

const store = observable({
  _query: { ...defaultQuery },
  _users: [],

  get query () {
    return toJS(this._query)
  },

  get users () {
    return toJS(this._users)
  },

  getUsers: action(async function (opts) {
    const { users = [], query = {} } = await aapi.getUsers(opts)

    this._users = users
    this._query = {
      ...defaultQuery,
      ...query
    }
  })
})

export default store
