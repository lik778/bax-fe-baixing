
import { observable, action, toJS } from 'mobx'

import * as fapi from 'api/fengming'
import * as mapi from 'api/meta'

const store = observable({
  _usingConditions: [],
  _allDiscounts: [],
  _coupons: [],

  _products: [],

  get usingConditions() {
    return toJS(this._usingConditions)
  },

  get allDiscounts() {
    return toJS(this._allDiscounts)
  },

  get coupons() {
    return toJS(this._coupons)
  },

  get products() {
    return toJS(this._products)
  },

  getProductDiscounts: action(async function(types) {
    this._allDiscounts = await mapi.getProductDiscounts(types)
  }),

  getConditions: action(async function() {
    const condition = await mapi.getCondition()
    this._usingConditions = condition.usingConditions
  }),

  getCoupons: action(async function(opts) {
    this._coupons = await mapi.getCoupons(opts)
  }),

  getProducts: action(async function() {
    const products = await fapi.getProducts([2, 4])
    this._products = products.reverse().map(p => {
      if (p.id === 4) {
        return {
          ...p,
          name: '升级版精品官网'
        }
      } else {
        return p
      }
    })
  })
})

export default store
