
import { observable, action, toJS } from 'mobx'
import clone from 'clone'

import * as api from 'api/fengming-mvp'
import * as fapi from 'api/fengming'

const emptyCampaign = {
  landingPageId: ''
}

const store = observable({
  _originCampaign: clone(emptyCampaign),
  _summary: {},

  get originCampaign() {
    return toJS(this._originCampaign)
  },

  get summary() {
    return toJS(this._summary)
  },

  getCampaignInfo: action(async function(id) {
    const c = await api.getCampaignInfo(id)
    c.landingPageId = String(c.extra.landingPageId)
    this._originCampaign = c
  }),

  getSummary: action(async function() {
    this._summary = await fapi.getSummary()
  }),

  clearStore: action(function() {
    this._originCampaign = clone(emptyCampaign)
  })
})

export default store
