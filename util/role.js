import {isPro} from '../config'

const isArray = Array.isArray

// global

export function allowSeeAccount(roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'BAIXING_USER'
  ])
}

export function allowSeeBxAd(roles) {
  // 只要 role 不仅仅是 BAIXING_USER 即可
  const currentRoles = normalizeRoles(roles)

  if (currentRoles.length === 1 &&
    currentRoles[0] === 'BAIXING_USER') {
    return false
  }

  return true
}

// order

export function allowPayOrder(roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'AGENT_ACCOUNTING'
  ])
}

export function allowQueryOrders(roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'AGENT_ACCOUNTING',
    'AGENT_SALES',
    'NORMAL_OPERATOR',
    'BAIXING_SALES',
    'BAIXING_USER'
  ])
}

export function allowAddOrder(roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'AGENT_ACCOUNTING',
    'NORMAL_OPERATOR',
    'BAIXING_SALES'
  ])
}

// user

export function allowAddUser(roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'AGENT_ACCOUNTING',
    'AGENT_SALES',
    'NORMAL_OPERATOR',
    'BAIXING_SALES'
  ])
}

export function allowQueryUsers(roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'AGENT_ACCOUNTING',
    'AGENT_SALES',
    'NORMAL_OPERATOR',
    'BAIXING_SALES'
  ])
}

// material

export function allowAddMaterial(roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'AGENT_SALES',
    'NORMAL_OPERATOR',
    'BAIXING_SALES',
    'BAIXING_USER'
  ])
}

export function allowQueryMaterials(roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'AGENT_SALES',
    'NORMAL_OPERATOR',
    'BAIXING_SALES',
    'BAIXING_USER'
  ])
}

export function allowUpdateMaterial(roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'AGENT_SALES',
    'NORMAL_OPERATOR',
    'BAIXING_SALES',
    'BAIXING_USER'
  ])
}

// ad

export function allowQueryAdItems(roles) {
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

export function allowAddAdItem(roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'NORMAL_OPERATOR',
    'BAIXING_SALES',
    'AGENT_SALES'
  ])
}

export function allowVerifyAd(roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'QA_OPERATOR',
    'DESIGN_QA_OPERATOR'
  ])
}

export function allowPauseAd(roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'NORMAL_OPERATOR'
  ])
}

export function allowContinueAd(roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'NORMAL_OPERATOR'
  ])
}

export function isBaixingSales(roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'BAIXING_SALES'
  ])
}

export function onlyAgentSales(roles) {
  const currentRoles = normalizeRoles(roles)

  const isAgentAccounting = currentRoles.includes('AGENT_ACCOUNTING')
  const isAgentSales = currentRoles.includes('AGENT_SALES')

  return isAgentSales && !isAgentAccounting
}

export function normalizeRoles(roles) {
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

export function checkRoles(currentRoles, validRoles) {
  let valid = false

  for (let r of validRoles) {
    if (currentRoles.includes(r)) {
      valid = true
      break
    }
  }

  return valid
}

export function allowNotSeeBwNewPrice(roles, agentId) {
  const currentRoles = normalizeRoles(roles)
  const isOnlyBaixingUser = currentRoles.includes('BAIXING_USER') && currentRoles.length === 1

  if (isPro) {
    return [2067, 2070, 2071, 2083, 2094, 2101, 2124, 2126, 2132, 2143].includes(agentId) && isOnlyBaixingUser
  }
  return [1].includes(agentId) && isOnlyBaixingUser
}

export function isSelfHelpUser(roles) {
  if (!isPro) {
    const shAgent = localStorage.getItem('shAgent')
    if (shAgent) return false
  }
  if (roles.length === 1) {
    return roles[0].nameEn === 'BAIXING_USER'
  }
  return false
}

export function allowSeeLongOrder(roles, agentId, salesId) {
  const currentRoles = normalizeRoles(roles)
  const isSales = currentRoles.includes('AGENT_SALES') || currentRoles.includes('AGENT_ACCOUNTING')
  if (isPro) {
    const isAgentId = [2263, 196, 2296, 2143, 2192, 2193, 2181, 2182, 2183, 2184, 2185, 2186, 2187, 2188, 2189, 2190, 2101, 2124, 2253, 770, 2094, 2313, 2314, 2275, 441, 2325].includes(agentId)
    const salesIds= ['131102','134902','134903','134904','134905','134906','134907','134908','134909','134910','134911','134912','134913','156602','102004','107601','141101','141102','143302','102407','141110','134916','134915','175501', '130007']
    const hasSalesId =  salesIds.some(o => new RegExp(`^${o}`).test(salesId))
    return isAgentId || (hasSalesId && isSales)
  }
  return [183].includes(agentId)
}
