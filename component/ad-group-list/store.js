
import { createStore } from 'vue-duo'

import {
  getMaterials,
  getAdGroups
} from './action'

const store = createStore({
  materials: [],
  groups: []
})

store.subscribeActions({
  [getMaterials]: ({materials = []}) => ({
    materials: [...materials]
  }),
  [getAdGroups]: ({groups = []}) => ({
    groups: [...groups]
  })
})

export default store
