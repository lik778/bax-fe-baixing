
import { observable, action, toJS } from 'mobx'
import { PRODUCT_TYPE_BIAOWANG } from 'constant/log'

import * as fapi from 'api/fengming'
import * as bapi from 'api/biaowang'
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
  totalLogs: 0,

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

  getLogs: action(async function({productType, ...params}) {
    let logs
    let total
    if (productType === PRODUCT_TYPE_BIAOWANG) {
      const reBuildBiaowangParams = (params) => {
        const {
          campaignId: promoteId,
          limit: size,
          offset,
          ...ohterParams
        } = params

        const page = offset / size

        return {
          page,
          size,
          promoteId,
          ...ohterParams
        }
      }
      const res = await bapi.getLogs(reBuildBiaowangParams(params))
      logs = res.content
      total = res.totalElements
    } else {
      const res = await fapi.getLogs(params)
      logs = res.logs
      total = res.total
    }
    this.totalLogs = total
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
