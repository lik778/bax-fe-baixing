
import { observable, action, toJS } from 'mobx'

import * as fapi from 'api/fengming'

const store = observable({
  _summary: {},

  get summary() {
    return toJS(this._summary)
  },

  getSummary: action(async function() {
    this._summary = await fapi.getSummary()
  }),

  clear: action(async function() {

  })
})

export default store
