
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

  emailMissing: false,
  currentUser: {}
})

store.subscribeActions({
  [getCurrentUser]: (user) => ({
    emailMissing: !user.email,
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
