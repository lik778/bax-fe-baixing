
const isArray = Array.isArray


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
