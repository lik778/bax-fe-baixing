import { action, observable, toJS } from 'mobx'
import { getIP } from 'util'
import { AllowCareFreeRecharge, isNormalUser, notAllowFengmingRecharge } from 'util/role'
import * as aapi from 'api/account'
import * as mapi from 'api/meta'
import * as qapi from 'api/qianci'
import Sentry from '../lib/sentry'
import { checkAuthorize } from 'api/fengming'
import { isAdplatformUser } from 'api/ad-platform'
import { whoAmI } from 'api/biaowang-plus'
import { AGENT_USER } from 'constant/bw-plus'

const gStore = observable({
  _currentUser: {
    roles: []
  },
  _allCategories: [],
  _allAreas: [],
  _allQianciAreas: {},
  _allRoles: [],
  _realation: '',
  _fengmingOptimizer: null,

  addUserLeadVisible: false,
  _queryInfo: {}, // 下线计划续费重新查价的信息

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
  get relation () {
    return toJS(this._realation)
  },
  get fengmingOptimizer () {
    return toJS(this._fengmingOptimizer)
  },
  get queryInfo () {
    return toJS(this._queryInfo)
  },
  toggleAddUserLeadVisible: action(function () {
    this.addUserLeadVisible = !this.addUserLeadVisible
  }),

  getCurrentUser: action(async function () {
    const currentUser = await aapi.getCurrentUser()
    const { roles = [], realAgentId, agentId, salesId } = currentUser
    currentUser.isYibaisouUser = false
    if (isNormalUser(roles)) {
      const { data: { role } } = await whoAmI()
      if (role === AGENT_USER) {
        currentUser.isYibaisouUser = true
      }
    }
    currentUser.shAgent = isNormalUser(roles)
    currentUser.allowFmRecharge = !notAllowFengmingRecharge(
      roles,
      realAgentId
    )
    currentUser.allowCareFreeRecharge = AllowCareFreeRecharge(roles, agentId, salesId)
    if (isNormalUser(roles)) {
      currentUser.isCareFreeUser = await isAdplatformUser(currentUser.id)
    }

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
  getFengmingOptimizer: action(async function (params) {
    const { data } = await checkAuthorize(params)
    this._fengmingOptimizer = data
  }),
  getAreas: action(async function () {
    this._allAreas = await mapi.getAreas()
  }),

  getQianciAreas: action(async function () {
    this._allQianciAreas = await qapi.getQcAllAreas()
  }),
  getRoles: action(async function () {
    this._allRoles = await aapi.getRoles()
  }),
  getRelation: action(async function (params) {
    const { relation } = await aapi.relation(params)
    this._realation = relation
  }),
  getQueryInfo: action(function (params) {
    this._queryInfo = params
  })
})

export default gStore
