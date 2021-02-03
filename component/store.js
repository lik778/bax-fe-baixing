import { observable, action, toJS } from 'mobx'
import { getIP } from 'util'
import { isNormalUser, notAllowFengmingRecharge } from 'util/role'
import * as aapi from 'api/account'
import * as mapi from 'api/meta'
import * as qapi from 'api/qianci'
import Sentry from '../lib/sentry'

const gStore = observable({
  _currentUser: {
    roles: []
  },
  _allCategories: [],
  _allAreas: [],
  _allQianciAreas: {},
  _allRoles: [],

  addUserLeadVisible: false,

  get currentUser () {
    return toJS(this._currentUser)
  },
  get allCategories () {
    return toJS(this._allCategories)
  },
  get allAreas () {
    return toJS(this._allAreas)
  },
  get allRoles () {
    return toJS(this._allRoles)
  },
  get allQianciAreas () {
    return toJS(this._allQianciAreas)
  },
  toggleAddUserLeadVisible: action(function () {
    this.addUserLeadVisible = !this.addUserLeadVisible
  }),

  getCurrentUser: action(async function () {
    const currentUser = await aapi.getCurrentUser()
    const { roles = [], realAgentId } = currentUser

    currentUser.shAgent = isNormalUser(roles)
    currentUser.allowFmRecharge = !notAllowFengmingRecharge(
      roles,
      realAgentId
    )

    this._currentUser = currentUser
    // 打点数据中添加用户身份信息
    window.__trackerData.common = {
      ...window.__trackerData.common,
      baixing_id: currentUser.baixingId,
      bax_id: currentUser.id
    }

    // Sentry 添加用户身份信息
    let ip
    try {
      ip = await getIP()
    } catch (noIP) {
      ip = 'unknown'
    } finally {
      Sentry.configureScope((scope) => {
        scope.setUser({
          ip_address: ip,
          id: currentUser.baixingId,
          name: currentUser.name,
          mobile: currentUser.mobile,
          baxId: currentUser.id
        })
      })
    }
  }),

  getCategories: action(async function () {
    this._allCategories = await mapi.getCategories()
  }),

  getAreas: action(async function () {
    this._allAreas = await mapi.getAreas()
  }),

  getQianciAreas: action(async function () {
    this._allQianciAreas = await qapi.getQcAllAreas()
  }),
  getRoles: action(async function () {
    this._allRoles = await aapi.getRoles()
  })
})

export default gStore
