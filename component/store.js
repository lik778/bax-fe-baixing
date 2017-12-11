
import { createStore } from 'vue-duo'

import {
  getCurrentUser,
  getCategories,
  getAreas,
  getRoles
} from './action'

const store = createStore({
  allCategories: [],
  allAreas: [],
  allRoles: [],

  currentUser: {}
})

store.subscribeActions({
  [getCurrentUser]: (user) => ({
    currentUser: {...user}
  }),
  [getCategories]: (categories) => ({
    allCategories: [...categories]
  }),
  [getAreas]: (areas) => ({
    allAreas: [...areas]
  }),
  [getRoles]: (roles) => ({
    allRoles: [...roles]
  })
})

export default store
