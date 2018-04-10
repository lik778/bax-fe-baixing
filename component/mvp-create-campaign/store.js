
import { observable, action, toJS } from 'mobx'

import * as fapi from 'api/fengming'

const store = observable({
  _summary: {},
  _usableBalance: 0,

  get summary() {
    return toJS(this._summary)
  },

  get usableBalance() {
    return toJS(this._usableBalance)
  },

  getSummary: action(async function() {
    this._summary = await fapi.getSummary()
  }),

  getUsableBalance: action(async function() {
    this._usableBalance = await fapi.getUsableBalance()
  }),

  clear: action(async function() {

  })
})

export default store
