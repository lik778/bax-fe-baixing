
import { observable, action, toJS } from 'mobx'

import * as fapi from 'api/fengming'

const store = observable({
  _logQuery: {},
  _logs: [],

  get logQuery() {
    return toJS(this._logQuery)
  },

  get logs() {
    return toJS(this._logs)
  },

  // opts: { type, time, offset, pageSize }
  getLogs: action(async function(opts) {
    const { query, logs } = await fapi.getLogs(opts)
    this._logQuery = query
    this._logs = logs
  })
})

export default store
