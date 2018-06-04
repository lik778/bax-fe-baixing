
import { observable, action, toJS } from 'mobx'

import * as aapi from 'api/account'
import * as mapi from 'api/meta'
import track from 'util/track'

const gStore = observable({
  _currentUser: {},
  _allCategories: [],
  _allAreas: [],
  _allRoles: [],

  addUserLeadVisible: false,

  get currentUser() {
    return toJS(this._currentUser)
  },
  get allCategories() {
    return toJS(this._allCategories)
  },
  get allAreas() {
    return toJS(this._allAreas)
  },
  get allRoles() {
    return toJS(this._allRoles)
  },

  toggleAddUserLeadVisible: action(function() {
    this.addUserLeadVisible = !this.addUserLeadVisible
  }),

  getCurrentUser: action(async function() {
    this._currentUser = await aapi.getCurrentUser()
  }),

  getCategories: action(async function() {
    this._allCategories = await mapi.getCategories()
  }),

  getAreas: action(async function() {
    this._allAreas = await mapi.getAreas()
  }),

  getRoles: action(async function() {
    this._allRoles = await aapi.getRoles()
  })
})

export default gStore
