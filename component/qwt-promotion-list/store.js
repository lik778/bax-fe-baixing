
import { observable, action, toJS } from 'mobx'

import * as fapi from 'api/fengming'

const defaultQuery = {
  statuses: '',
  source: '',
  areas: '',
  id: '',

  offset: 0,
  limit: 20,
  total: 0
}

const store = observable({
  showMoreFilters: false,

  _campaigns: [],
  _query: {
    ...defaultQuery
  },

  get campaigns() {
    return toJS(this._campaigns)
  },

  get query() {
    return toJS(this._query)
  },

  switchShowMoreFilters: action(function() {
    this.showMoreFilters = !this.showMoreFilters
  }),

  getCurrentCampaigns: action(async function(opts) {
    const {campaigns = [], query} = await fapi.getCurrentCampaigns(opts)
    this._campaigns = campaigns
    this._query = {
      ...defaultQuery,
      ...query
    }

    return {
      campaigns: this.campaigns,
      query: this.query
    }
  })
})

export default store
