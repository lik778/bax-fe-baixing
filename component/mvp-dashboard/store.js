
import { observable, action, toJS } from 'mobx'

import * as api from 'api/fengming-mvp'

const store = observable({
  _allCampaigns: [],
  _summary: {},

  _statistics: [],
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

  downloadCsv: action(async function(opts) {
    const url = await api.getMvpReport({
      ...opts,
      exportCsv: 1
    })

    window.open(url)
  }),

  queryCampaigns: action(async function(opts) {
    const q = {
      limit: 300,
      ...opts
    }
    const { campaigns } = await api.getCampaigns(q)
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
