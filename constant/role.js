
/**
 * TODO - mv to util
 */

const isArray = Array.isArray

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

  return currentRoles.includes('QA_OPERATOR')
}

/**
 * private
 */

function normalizeRoles(roles) {
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

function checkRoles(currentRoles, validRoles) {
  let valid = false

  for (let r of validRoles) {
    if (currentRoles.includes(r)) {
      valid = true
      break
    }
  }

  return valid
}
