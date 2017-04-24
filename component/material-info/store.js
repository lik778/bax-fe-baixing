
import { createStore } from 'vue-duo'

import {
  getMaterial
} from './action'

const store = createStore({
  material: {}
})

store.subscribeActions({
  [getMaterial]: (material) => ({
    material: {...material}
  })
})

export default store
