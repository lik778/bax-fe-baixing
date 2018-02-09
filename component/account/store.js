
import { observable, action, toJS } from 'mobx'

import * as fapi from 'api/fengming'
import * as mapi from 'api/meta'

const store = observable({
  _logQuery: {},
  _logs: [],

  _summary: {},
  _coupons: [],

  get logQuery() {
    return toJS(this._logQuery)
  },
  get logs() {
    return toJS(this._logs)
  },
  get summary() {
    return toJS(this._summary)
  },
  get coupons() {
    return toJS(this._coupons)
  },

  // opts: { type, time, offset, pageSize }
  getLogs: action(async function(opts) {
    const { query, logs } = await fapi.getLogs(opts)
    this._logQuery = query
    this._logs = logs
  }),

  getSummary: action(async function() {
    this._summary = await fapi.getSummary()
  }),

  getCoupons: action(async function(opt) {
    this._coupons = await mapi.getCoupons(opt)
  })
})

export default store
