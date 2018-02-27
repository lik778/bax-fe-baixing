
import { observable, action, toJS } from 'mobx'

import * as fapi from 'api/fengming'
import * as mapi from 'api/meta'

const store = observable({
  _mvpSummary: {
    consume: 0,
    clicks: 0,
    shows: 0
  },
  _summary: {
    campaignCount: 0,
    balance: 0,

    consume: 0,
    budget: 0,
    clicks: 0,
    shows: 0
  },
  _coupons: [],

  get mvpSummary() {
    return toJS(this._mvpSummary)
  },
  get summary() {
    return toJS(this._summary)
  },
  get coupons() {
    return toJS(this._coupons)
  },

  getHomepageSummary: action(async function() {
    this._summary = await fapi.getHomepageSummary()
  }),

  getCoupons: action(async function(opt) {
    this._coupons = await mapi.getCoupons(opt)
  })
})

export default store
