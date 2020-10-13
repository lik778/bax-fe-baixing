
import { observable, action, toJS } from 'mobx'
import { PRODUCT_TYPE_BIAOWANG } from 'constant/log'

import * as fapi from 'api/fengming'
import * as bapi from 'api/biaowang'
import * as mapi from 'api/meta'
import * as api from 'api/account'

const store = observable({
  _balance: {},
  _coupons: [],
  _logs: [],
  totalLogs: 0,

  get logs() {
    return toJS(this._logs)
  },
  get coupons() {
    return toJS(this._coupons)
  },

  get balance() {
    return toJS(this._balance)
  },

  getLogs: action(async function({productType, ...params}) {
    let logs
    let total
    if (productType === PRODUCT_TYPE_BIAOWANG) {
      const reBuildBiaowangParams = (params) => {
        const {
          selectId: word,
          limit: size,
          offset,
          ...ohterParams
        } = params

        const page = offset / size

        return {
          page,
          size,
          word,
          ...ohterParams
        }
      }
      const res = await bapi.getLogs(reBuildBiaowangParams(params))
      logs = res.content
      total = res.totalElements
    } else {
      const reBuildFengmingParams = ({selectId, ...ohterParams}) => {
        return {
          campaignId: selectId,
          ...ohterParams
        }
      }
      const res = await fapi.getLogs(reBuildFengmingParams(params))
      logs = res.logs
      total = res.total
    }
    this.totalLogs = total
    this._logs = logs
  }),

  getCoupons: action(async function(opt) {
    this._coupons = await mapi.getCoupons(opt)
  }),

  getBalance: action(async function() {
    this._balance = await api.getCurrentAllBalanceBreif()
  })
})

export default store
