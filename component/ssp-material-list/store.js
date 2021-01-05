
import { observable, action, toJS } from 'mobx'

import * as mapi from 'api/material'

const defaultQuery = {
  offset: 0,
  limit: 20,
  total: 0,

  createdAtFrom: '',
  createdAtTo: '',
  userId: '',
  name: '',
  slot: ''
}

const store = observable({
  _query: { ...defaultQuery },
  _materials: [],

  get materials() {
    return toJS(this._materials)
  },

  get query() {
    return toJS(this._query)
  },

  getMaterials: action(async function(opts) {
    const { materials = [], query = {} } = await mapi.getMaterials(opts)
    this._materials = materials
    this._query = {
      ...defaultQuery,
      ...query
    }
  })
})

export default store
