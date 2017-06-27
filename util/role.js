
const isArray = Array.isArray

// global

export function allowSeeDashboard(roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'DATA_OPERATOR'
  ])
}

export function allowSeeAccount(roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'BAIXING_USER'
  ])
}

// order

export function allowPayOrder(roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'AGENT_ACCOUNTING'
  ])
}

export function allowGetOrderPayUrl(roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'NORMAL_OPERATOR',
    'BAIXING_SALES'
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
