
import { observable, action, toJS } from 'mobx'

import * as fapi from 'api/fengming'

const defaultQuery = {
  statuses: [],
  source: [],
  areas: [],
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
  usableBalance: 0,
  _summary: {},

  get campaigns() {
    return toJS(this._campaigns)
  },

  get query() {
    return toJS(this._query)
  },

  get summary() {
    return toJS(this._summary)
  },

  switchShowMoreFilters: action(function() {
    this.showMoreFilters = !this.showMoreFilters
  }),

  getCurrentCampaigns: action(async function(opts) {
    this._query = {
      ...defaultQuery,
      ...opts
    }
    const {campaigns = []} = await fapi.getCurrentCampaigns(opts)
    this._campaigns = campaigns

    return {
      campaigns: this.campaigns,
      query: this.query
    }
  }),

  getUsableBalance: action(async function() {
    this.usableBalance = await fapi.getUsableBalance()
  }),
  getSummary: action(async function() {
    this._summary = await fapi.getHomepageSummary()
  })

})

export default store
