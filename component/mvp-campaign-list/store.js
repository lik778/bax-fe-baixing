
import { observable, action, toJS } from 'mobx'
import clone from 'clone'

import * as api from 'api/fengming-mvp'

const defaultQuery = {
  statuses: '',
  sources: '',
  areas: '',
  id: '',

  offset: 0,
  total: 0,
  limit: 20
}

const store = observable({
  _query: clone(defaultQuery),
  _campaigns: [],

  get campaigns() {
    return toJS(this._campaigns)
  },

  get query() {
    return toJS(this._query)
  },

  getCampaigns: action(async function(opts) {
    this._query = {
      ...this._query,
      ...opts
    }

    const {
      campaigns,
      total
    } = await api.getCampaigns(this.query)

    this._campaigns = campaigns
    this._query.total = total
  })
})

export default store
