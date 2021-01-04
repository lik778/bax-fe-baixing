
import { observable, action, toJS } from 'mobx'

import * as mapi from 'api/meta'

const store = observable({
  _usingConditions: [],
  _validCoupons: [],
  _coupons: [],

  get usingConditions() {
    return toJS(this._usingConditions)
  },

  get validCoupons() {
    return toJS(this._validCoupons)
  },

  get coupons() {
    return toJS(this._coupons)
  },

  getValidCoupons: action(async function() {
    this._validCoupons = await mapi.getCoupons({
      onlyValid: true,
      status: 0
    })
  }),

  getConditions: action(async function() {
    const condition = await mapi.getCondition()
    this._usingConditions = condition.usingConditions
  }),

  redeemCoupon: action(async function(code) {
    const coupon = await mapi.redeemCoupon(code)
    if (coupon.id) {
      this._coupons = [coupon, ...this.coupons]
    }
  }),

  getCoupons: action(async function() {
    this._coupons = await mapi.getCoupons()
  })
})

export default store
