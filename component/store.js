import { action, observable, toJS } from 'mobx'
import { getIP } from 'util'
import { AllowCareFreeRecharge, isNormalUser, notAllowFengmingRecharge } from 'util/role'
import * as aapi from 'api/account'
import * as mapi from 'api/meta'
import * as qapi from 'api/qianci'
import Sentry from '../lib/sentry'
import { checkAuthorize, getSpecail } from 'api/fengming'
import { isAdplatformUser } from 'api/ad-platform'
import { whoAmI } from 'api/biaowang-plus'
import { AGENT_USER } from 'constant/bw-plus'
import { getQueryParams } from 'constant/fengming'

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

  addUserLeadVisible: false, // 1
  _queryInfo: {}, // 下线计划续费重新查价的信息

  get currentUser () { // 2
    return toJS(this._currentUser)
  },
  get allCategories () { // 3
    return toJS(this._allCategories)
  },
  get allAreas () { // 4
    return toJS(this._allAreas)
  },
  get allRoles () { // 5
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
    const userId = getQueryParams('user_id')
    const { data: isSpecial } = await getSpecail({
      type: 'GRAY_KEYWORD_MATCHING_LIST',
      user_id: userId
    })
    window.localStorage.setItem('isSpecial', JSON.stringify(isSpecial))
    const currentUser = await aapi.getCurrentUser()
    const { roles = [], realAgentId, agentId, salesId } = currentUser
    currentUser.isSpecial = isSpecial
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
