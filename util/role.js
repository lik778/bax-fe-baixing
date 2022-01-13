import { isPro } from '../config'
import gStore from 'com/store'

const isArray = Array.isArray

// eslint-disable-next-line no-unused-vars
const ROLES_ENUM = [
  { name: '代理商提单员', name_en: 'AGENT_ACCOUNTING' },
  { name: '代理商销售', name_en: 'AGENT_SALES' },
  { name: '运营', name_en: 'NORMAL_OPERATOR' },
  { name: '自建销售', name_en: 'BAIXING_SALES' },
  { name: '百姓用户', name_en: 'BAIXING_USER' },
  { name: '产品审核', name_en: 'QA_OPERATOR' },
  { name: '设计审核', name_en: 'DESIGN_QA_OPERATOR' },
  { name: '数据运营', name_en: 'DATA_OPERATOR' },
  { name: '凤鸣运营', name_en: 'FENGMING_OPERATOR' },
  { name: '供应商审核', name_en: 'VENDOR_OPERATOR' }
]
const USES_ID = [
  1001,
  1002,
  1003,
  1004
]

export function isSales (roles) {
  const currentRoles = normalizeRoles(roles)
  return checkRoles(currentRoles, [
    'AGENT_SALES',
    'BAIXING_SALES'
  ])
}

export function isWordUser (id) {
  const res = USES_ID.some(item => item === id)
  return res
}

// global

export function allowSeeAccount (roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'BAIXING_USER'
  ])
}

export function allowSeeBxAd (roles) {
  // 只要 role 不仅仅是 BAIXING_USER 即可
  const currentRoles = normalizeRoles(roles)

  if (currentRoles.length === 1 &&
    currentRoles[0] === 'BAIXING_USER') {
    return false
  }

  return true
}

// order

export function allowPayOrder (roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'AGENT_ACCOUNTING'
  ])
}

export function allowQueryOrders (roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'AGENT_ACCOUNTING',
    'AGENT_SALES',
    'NORMAL_OPERATOR',
    'BAIXING_SALES',
    'BAIXING_USER'
  ])
}

export function allowAddOrder (roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'AGENT_ACCOUNTING',
    'NORMAL_OPERATOR',
    'BAIXING_SALES'
  ])
}

// user

export function allowAddUser (roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'AGENT_ACCOUNTING',
    'AGENT_SALES',
    'NORMAL_OPERATOR',
    'BAIXING_SALES'
  ])
}

export function allowQueryUsers (roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'AGENT_ACCOUNTING',
    'AGENT_SALES',
    'NORMAL_OPERATOR',
    'BAIXING_SALES'
  ])
}

// material

export function allowAddMaterial (roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'AGENT_SALES',
    'NORMAL_OPERATOR',
    'BAIXING_SALES',
    'BAIXING_USER'
  ])
}

export function allowQueryMaterials (roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'AGENT_SALES',
    'NORMAL_OPERATOR',
    'BAIXING_SALES',
    'BAIXING_USER'
  ])
}

export function allowUpdateMaterial (roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'AGENT_SALES',
    'NORMAL_OPERATOR',
    'BAIXING_SALES',
    'BAIXING_USER'
  ])
}

// ad

export function allowQueryAdItems (roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'AGENT_SALES',
    'NORMAL_OPERATOR',
    'BAIXING_SALES',
    'BAIXING_USER',
    'QA_OPERATOR',
    'DESIGN_QA_OPERATOR'
  ])
}

export function allowAddAdItem (roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'NORMAL_OPERATOR',
    'BAIXING_SALES',
    'AGENT_SALES'
  ])
}

export function allowVerifyAd (roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'QA_OPERATOR',
    'DESIGN_QA_OPERATOR'
  ])
}

export function allowPauseAd (roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'NORMAL_OPERATOR'
  ])
}

export function allowContinueAd (roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'NORMAL_OPERATOR'
  ])
}

export function allowSeeDiamondSite (roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'BAIXING_USER'
  ])
}

export function isBaixingSales (roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'BAIXING_SALES'
  ])
}

export function onlyAgentSales (roles) {
  const currentRoles = normalizeRoles(roles)

  const isAgentAccounting = currentRoles.includes('AGENT_ACCOUNTING')
  const isAgentSales = currentRoles.includes('AGENT_SALES')

  return isAgentSales && !isAgentAccounting
}

export function onlyAgentAccounting (roles) {
  const currentRoles = normalizeRoles(roles)
  if (currentRoles.length === 1 && currentRoles.includes('AGENT_ACCOUNTING')) {
    return true
  }
  return false
}

export function isAgentAccounting (roles) {
  const currentRoles = normalizeRoles(roles)
  return currentRoles.includes('AGENT_ACCOUNTING')
}

export function normalizeRoles (roles) {
  if (!isArray(roles)) {
    return []
  }

  return roles.map(r => {
    if (typeof r === 'string') {
      return r
    }

    return r.nameEn
  })
}

export function checkRoles (currentRoles, validRoles) {
  let valid = false

  for (const r of validRoles) {
    if (currentRoles.includes(r)) {
      valid = true
      break
    }
  }

  return valid
}

export function allowNotSeeBwNewPrice (roles, agentId) {
  const currentRoles = normalizeRoles(roles)
  const isOnlyBaixingUser = currentRoles.includes('BAIXING_USER') && currentRoles.length === 1

  if (isPro) {
    return [2067, 2070, 2071, 2083, 2094, 2101, 2124, 2126, 2132, 2143].includes(agentId) && isOnlyBaixingUser
  }
  return [1].includes(agentId) && isOnlyBaixingUser
}

export function isNormalUser (roles = []) {
  const shAgent = localStorage.getItem('shAgent')
  if (shAgent) return false
  if (roles.length === 1) {
    return roles[0].nameEn === 'BAIXING_USER'
  }
  return false
}

export function allowSeeLongOrder (roles, agentId, salesId) {
  const currentRoles = normalizeRoles(roles)
  const isSales = currentRoles.includes('AGENT_SALES') || currentRoles.includes('AGENT_ACCOUNTING')
  if (isPro) {
    const isAgentId = [2263, 196, 2296, 2143, 2192, 2193, 2181, 2182, 2183, 2184, 2185, 2186, 2187, 2188, 2189, 2190, 2101, 2124, 2253, 770, 2094, 2313, 2314, 2275, 441, 2325].includes(agentId)
    const salesIds = ['131102', '134902', '134903', '134904', '134905', '134906', '134907', '134908', '134909', '134910', '134911', '134912', '134913', '156602', '102004', '107601', '141101', '141102', '143302', '102407', '141110', '134916', '134915', '175501', '130007', '156603', '102209', '102210', '105401', '134917', '159502', '159105', '185107', '185108', '173103', '177109', '177106', '173101', '185101', '155116', '102102', '155305', '151001', '121202', '151003', '153901', '176805', '130008']
    const hasSalesId = salesIds.some(o => new RegExp(`^${o}`).test(salesId))
    return isAgentId || (hasSalesId && isSales)
  }
  return [183].includes(agentId)
}

export function notAllowFengmingRecharge (roles, agentId) {
  const currentRoles = normalizeRoles(roles)
  const isOnlyBaixingUser = currentRoles.includes('BAIXING_USER') && currentRoles.length === 1
  if (isPro) {
    return !!agentId && isOnlyBaixingUser
    // return [31, 2263, 1921, 1256, 1257, 1466, 1474, 1736, 196, 1457, 2295, 2193, 2181,
    //   2182, 2183, 2184, 2185, 2186, 2187, 2188, 2189, 2190, 2313, 2314, 2337, 1302,
    //   2101, 2124, 770, 65, 2094, 1797, 984, 136, 139, 2070, 2071, 2275, 35, 36, 1263, 1678,
    //   2435, 2449, 2450, 2451, 2495, 2512, 2553, 2144, 2420, 2550, 2332, 2443, 2491, 1779, 69, 2471, 77, 2722].includes(agentId) && isOnlyBaixingUser
  }
  return !!agentId && isOnlyBaixingUser
}

export function AllowCareFreeRecharge (roles, agentId, salesId) {
  const currentRoles = normalizeRoles(roles)
  let hasSalesIds = false
  let hasAgentIds = false
  const salesIds = isPro ? ['159502', '157406', '130005'] : ['139601']
  const agentIds = isPro ? [139, 1797, 1214] : [50]
  if (currentRoles.includes('AGENT_SALES')) {
    hasSalesIds = salesIds.some(o => `${salesId}`.startsWith(o))
  }
  if (currentRoles.includes('AGENT_ACCOUNTING')) {
    hasAgentIds = agentIds.includes(agentId)
  }
  return isBaixingSales(roles) || hasSalesIds || hasAgentIds
}

export const relationEnum = {
  SELF: 'self', // 直接用户
  SUB: 'sub', // 下属销售用户
  NONE: '' || null // 无关联
}
export function relationAllow () {
  const relation = gStore.relation
  switch (relation) {
    case relationEnum.SELF:
      return true
    case relationEnum.SUB:
      return false
    case relationEnum.NONE:
      return false
    default:
      return true
  }
}

export function allowBwplus (roles, agentId, salesId) {
  const currentRoles = normalizeRoles(roles)
  const isAgent = currentRoles.includes('AGENT_SALES')
  const isSales = currentRoles.includes('BAIXING_SALES')
  if (isPro) {
    const isAgentId = isAgent && ['187108', '131102', '130005', '151015', '147010'].includes(salesId.toString().substr(0, 6))
    const hasSalesId = isSales && [4998, 21897, 21568, 9121, 9050].includes(salesId)
    return isNormalUser(roles) ? true : (isAgentId || hasSalesId)
  }
  const isAgentId = isAgent && ['139601'].includes(salesId.toString().substr(0, 6))
  const hasSalesId = isSales && [5064].includes(salesId)
  return isNormalUser(roles) ? true : (isAgentId || hasSalesId)
}

export function allowBwplusDashboard (userInfo) {
  const { roles, realAgentId, agentId } = userInfo
  const currentRoles = normalizeRoles(roles)
  const isAgent = currentRoles.includes('AGENT_SALES')
  const isSales = currentRoles.includes('BAIXING_SALES')
  if (isPro) {
    if ((isNormalUser(roles) && realAgentId === 2143) || (isNormalUser(roles) && !realAgentId)) {
      return true
    }
    if (isSales || (isAgent && agentId === 2143)) {
      return true
    }
    return false
  }
  if ((isNormalUser(roles) && realAgentId === 50) || (isNormalUser(roles) && !realAgentId)) {
    return true
  }
  if (isSales || (isAgent && agentId === 50)) {
    return true
  }
  return false
}

export function allowCareFreeDashboard (userInfo) {
  const { roles, agentId, salesId } = userInfo
  const currentRoles = normalizeRoles(roles)
  const isSales = currentRoles.includes('BAIXING_SALES')
  if (isNormalUser(roles)) {
    return userInfo.isCareFreeUser
  }
  return isSales || AllowCareFreeRecharge(roles, agentId, salesId)
}
