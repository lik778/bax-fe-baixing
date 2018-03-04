
import { observable, action, toJS } from 'mobx'

import * as api from 'api/fengming-mvp'

const store = observable({
  _allCampaigns: [],
  _statistics: [],
  _summary: {},
  limit: 100,
  offset: 0,
  total: 0,

  get allCampaigns() {
    return toJS(this._allCampaigns)
  },

  get statistics() {
    return toJS(this._statistics)
  },

  get summary() {
    return toJS(this._summary)
  },

  clearStatistics: action(function() {
    this._statistics = []
  }),

  downloadCsv: action(function(opts) {
    return api.getMvpReport({
      ...opts,
      exportCsv: 1
    })
  }),

  queryCampaigns: action(async function(opts) {
    const { campaigns } = await api.getCampaigns(opts)
    this._allCampaigns = campaigns
  }),

  getReport: action(async function(opts) {
    const result = await api.getMvpReport(opts)
    const { rows, total, offset, summary } = result

    this._statistics = rows
    this._summary = summary
    this.offset = offset
    this.total = total
  })
})

export default store
