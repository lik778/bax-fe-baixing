
import { observable, action, toJS } from 'mobx'

import * as fapi from 'api/fengming'

const store = observable({
  _products: [],

  get products() {
    return toJS(this._products)
  },

  getProducts: action(async function() {
    const products = await fapi.getProducts([2, 4])
    this._products = products.map(p => {
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
