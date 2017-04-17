
import { createStore } from 'vue-duo'

import {
  getMaterials
} from './action'

const store = createStore({
  materials: []
})

store.subscribeActions({
  [getMaterials]: ({materials = []}) => ({
    materials
  })
})

export default store
