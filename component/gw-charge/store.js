
import { observable, action, toJS } from 'mobx'

import * as fapi from 'api/fengming'
import * as mapi from 'api/meta'

const store = observable({
  _allDiscounts: [],

  _packages: [],
  _products: [],

  get allDiscounts() {
    return toJS(this._allDiscounts)
  },

  get packages() {
    return toJS(this._packages)
  },

  get products() {
    return toJS(this._products)
  },

  getProductDiscounts: action(async function() {
    this._allDiscounts = await mapi.getProductDiscounts([2, 4])
  }),

  getProductPackages: action(async function(type) {
    this._packages = await fapi.getProductPackages(type)
  }),

  getProducts: action(async function() {
    const products = await fapi.getProducts([4, 5, 6])
    this._products = products
  })
})

export default store
