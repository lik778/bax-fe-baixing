
/**
 * TODO - mv to util
 */

const isArray = Array.isArray

export function allowAddUser(roles) {
  const currentRoles = normalizeRoles(roles)

  return currentRoles.includes('AGENT_ACCOUNTING') ||
    currentRoles.includes('AGENT_SALES') ||
    currentRoles.includes('NORMAL_OPERATOR') ||
    currentRoles.includes('BAIXING_SALES')
}

export function allowQueryUsers(roles) {
  const currentRoles = normalizeRoles(roles)

  return currentRoles.includes('AGENT_ACCOUNTING') ||
    currentRoles.includes('AGENT_SALES') ||
    currentRoles.includes('NORMAL_OPERATOR') ||
    currentRoles.includes('BAIXING_SALES')
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
