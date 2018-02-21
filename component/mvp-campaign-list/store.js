
import { observable, action, toJS } from 'mobx'

import * as api from 'api/fengming-mvp'

const store = observable({
  _campaigns: [],

  get campaigns() {
    return toJS(this._campaigns)
  },

  getCampaigns: action(async function() {
  })
})

export default store
