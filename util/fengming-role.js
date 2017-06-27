
import {
  normalizeRoles,
  checkRoles
} from './role'

// sidebar

export function allowSeeGw(roles, uid) {
  return uid === 88
}

export function allowSeeQwtPromotion(roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'BAIXING_USER'
  ])
}

export function allowSeeQwtReport(roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'BAIXING_USER'
  ])
}

//

export function allowGetOrderPayUrl(roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'BAIXING_SALES',
    'BAIXING_USER'
  ])
}

export function allowPayOrder(roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'AGENT_ACCOUNTING'
  ])
}
