
import { observable, action, toJS } from 'mobx'

import * as fapi from 'api/fengming'
import * as api from 'api/fengming-mvp'

const store = observable({
  _summary: {},
  _mvpSummary: {},

  get summary() {
    return toJS(this._summary)
  },

  get mvpSummary() {
    return toJS(this._mvpSummary)
  },

  getSummary: action(async function() {
    this._summary = await fapi.getSummary()
  }),

  getMvpSummary: action(async function() {
    this._mvpSummary = await api.getMvpSimpleReport()
  }),

  clear: action(async function() {

  })
})

export default store
