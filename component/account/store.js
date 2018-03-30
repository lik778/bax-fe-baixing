
import { observable, action, toJS } from 'mobx'

import * as fapi from 'api/fengming'
import * as mapi from 'api/meta'

const store = observable({
  _consumeQuery: {},
  _consumeLogs: [],

  _chargeQuery: {},
  _chargeLogs: [],

  _summary: {},
  _coupons: [],

  get consumeQuery() {
    return toJS(this._consumeQuery)
  },
  get consumeLogs() {
    return toJS(this._consumeLogs)
  },
  get chargeQuery() {
    return toJS(this._chargeQuery)
  },
  get chargeLogs() {
    return toJS(this._chargeLogs)
  },
  get summary() {
    return toJS(this._summary)
  },
  get coupons() {
    return toJS(this._coupons)
  },

  // opts: { type, time, offset, pageSize }
  getConsumeLogs: action(async function(opts) {
    // const { query, logs } = await fapi.getLogs(opts)
    this._consumeQuery = {}
    this._consumeLogs = []
  }),
  // opts: { type, time, offset, pageSize }
  getChargeLogs: action(async function() {
    this._chargeQuery = {}
    this._chargeLogs = []
  }),
  getSummary: action(async function() {
    this._summary = await fapi.getSummary()
  }),

  getCoupons: action(async function(opt) {
    this._coupons = await mapi.getCoupons(opt)
  })
})

export default store
