
import { observable, action, toJS } from 'mobx'

import * as fapi from 'api/fengming'
import * as mapi from 'api/meta'

const store = observable({
  _usingConditions: [],
  _allDiscounts: [],
  _products: [],
  _coupons: [],

  get usingConditions () {
    return toJS(this._usingConditions)
  },
  get allDiscounts () {
    console.log(toJS(this._allDiscounts))
    return toJS(this._allDiscounts)
  },
  get products () {
    return toJS(this._products)
  },
  get coupons () {
    return toJS(this._coupons)
  },

  getProductDiscounts: action(async function (types) {
    this._allDiscounts = await mapi.getProductDiscounts(types)
  }),

  getProducts: action(async function (type) {
    this._products = await fapi.getProducts(type)
  }),

  getConditions: action(async function () {
    const condition = await mapi.getCondition()
    this._usingConditions = condition.usingConditions
  }),

  getCoupons: action(async function (opts) {
    this._coupons = await mapi.getCoupons(opts)
  })
})

export default store
