
import { observable, action, toJS } from 'mobx'

import * as fapi from 'api/fengming'
import * as mapi from 'api/meta'

const emptyQuery = {
  fromDate: 0,
  toDate: 0,
  offset: 0,
  limit: 10,
  total: 10
}

const store = observable({
  _consumeQuery: {
    ...emptyQuery
  },
  _consumeLogs: [],

  _chargeQuery: {
    ...emptyQuery
  },
  _chargeLogs: [],

  _summary: {},
  _coupons: [],

  _logs: [],

  get logs() {
    return toJS(this._logs)
  },

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
  getLogs: action(async function(opts) {
    const { total, logs } = await fapi.getLogs(opts)
    console.log(logs)
    this.total = total
    this._logs = logs
  }),

  clearConsumeLogs: action(async function() {
    this._consumeQuery = {
      ...emptyQuery
    }
    this._consumeLogs = []
  }),
  getConsumeLogs: action(async function(opts) {
    this._consumeQuery = {
      ...this._consumeQuery,
      ...opts
    }
    const { logs, total } = await fapi.getChangeLogs(this.consumeQuery)
    this._consumeQuery.total = total
    this._consumeLogs = logs
  }),

  clearChargeLogs: action(function() {
    this._chargeQuery = {
      ...emptyQuery
    }
    this._chargeLogs = []
  }),
  getChargeLogs: action(async function(opts) {
    this._chargeQuery = {
      ...this._chargeQuery,
      ...opts
    }
    const { logs, total } = await fapi.getChargeLogs(this.chargeQuery)
    this._chargeQuery.total = total
    this._chargeLogs = logs
  }),

  getSummary: action(async function() {
    this._summary = await fapi.getSummary()
  }),

  getCoupons: action(async function(opt) {
    this._coupons = await mapi.getCoupons(opt)
  })
})

export default store
