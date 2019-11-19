
import { observable, action, toJS } from 'mobx'

import * as aapi from 'api/account'
import * as mapi from 'api/meta'

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
    const currentUser = this._currentUser = await aapi.getCurrentUser()
    // 打点数据中添加用户身份信息
    window.__trackerData.common = {
      ...window.__trackerData.common,
      baixing_id: currentUser.baixingId,
      bax_id: currentUser.id
    }
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
