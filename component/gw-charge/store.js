
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

  getProductDiscounts: action(async function() {
    this._allDiscounts = await mapi.getProductDiscounts([2, 4])
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
        // 新
        return {
          ...p,
          name: '精品官网'
        }
      } else {
        // 老
        return {
          ...p,
          name: '精品官网(旧版)'
        }
      }
    })
  })
})

export default store
