
import { createStore } from 'vue-duo'

import {
  getProductDiscounts,
  getProductPackages,
  getProducts
} from './action'

const store = createStore({
  allDiscounts: [],
  packages: [],
  products: []
})

store.subscribeActions({
  [getProductDiscounts]: (discounts) => ({
    allDiscounts: [...discounts]
  }),
  [getProductPackages]: (packages) => ({
    packages
  }),
  [getProducts]: (products) => ({
    products
  })
})

export default store
