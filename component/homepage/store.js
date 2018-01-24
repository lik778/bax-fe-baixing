
import * as fapi from 'api/fengming'
import * as mapi from 'api/meta'

import {
  observable,
  action
} from 'mobx'

const homepageStore = observable({
  coupons: [],
  summary: {
    campaignCount: 0,
    balance: 0
  },
  getSummary: action(async function() {
    this.summary = await fapi.getHomepageSummary()
  }),
  getCoupons: action(async function(opts) {
    this.coupons = await mapi.getCoupons(opts)
  })
})

export default homepageStore
