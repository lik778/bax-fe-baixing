
import { observable, action, toJS } from 'mobx'

import * as fapi from 'api/fengming'
import * as mapi from 'api/meta'

const store = observable({
  _usingConditions: [],
  _allDiscounts: [],
  _packages: [],
  _products: [],
  _coupons: [],

  get usingConditions() {
    return toJS(this._usingConditions)
  },
  get allDiscounts() {
    return toJS(this._allDiscounts)
  },
  get packages() {
    return toJS(this._packages)
  },
  get products() {
    return toJS(this._products)
  },
  get coupons() {
    return toJS(this._coupons)
  },

  getProductDiscounts: action(async function(types) {
    this._allDiscounts = await mapi.getProductDiscounts(types)
  }),

  getProductPackages: action(async function(type) {
    this._packages = await fapi.getProductPackages(type)
  }),

  getProducts: action(async function(type) {
    this._products = await fapi.getProducts(type)
  }),

  getConditions: action(async function() {
    const condition = await mapi.getCondition()
    this._usingConditions = condition.usingConditions
  }),

  getCoupons: action(async function(opts) {
    this._coupons = await mapi.getCoupons(opts)
  })
})

export default store
