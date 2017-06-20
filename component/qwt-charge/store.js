
import { createStore } from 'vue-duo'

import {
  getProductPackages,
  getProducts
} from './action'

const store = createStore({
  productPackages: [],
  products: []
})

store.subscribeActions({
  [getProductPackages]: (productPackages) => ({
    productPackages
  }),
  [getProducts]: (products) => ({
    products
  })
})

export default store
