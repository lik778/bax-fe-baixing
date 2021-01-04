
import { observable, action, toJS } from 'mobx'

import * as oapi from 'api/order'

const store = observable({
  _orderInfo: {
    order: {}
  },
  _logs: [],

  get orderInfo() {
    return toJS(this._orderInfo)
  },

  get logs() {
    return toJS(this._logs)
  },

  getOrderLogs: action(async function(id) {
    this._logs = await oapi.getOrderLogs(id)
  }),

  getOrderInfo: action(async function(id) {
    this._orderInfo = await oapi.getOrderInfo(id)
  })
})

export default store
