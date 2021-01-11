
import { observable, action, toJS } from 'mobx'

import * as fapi from 'api/fengming'
import * as mapi from 'api/meta'

const store = observable({
  _allDiscounts: [],
  _products: [],

  get allDiscounts () {
    return toJS(this._allDiscounts)
  },
  get products () {
    return toJS(this._products)
  },

  getProductDiscounts: action(async function (types) {
    this._allDiscounts = await mapi.getProductDiscounts(types)
  }),

  getProducts: action(async function (type) {
    this._products = await fapi.getProducts(type)
  })
})

export default store
