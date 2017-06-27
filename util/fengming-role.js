
import {
  normalizeRoles,
  checkRoles
} from './role'

// sidebar

const specialUserId = 1 // 康品汇 特权 自建销售

export function allowSeeGw(roles, uid) {
  return uid === specialUserId
}

export function allowSeeQwtCharge(roles, uid) {
  const currentRoles = normalizeRoles(roles)

  if (uid === specialUserId) {
    return true
  }

  return checkRoles(currentRoles, [
    'AGENT_ACCOUNTING',
    'AGENT_SALES',
    'BAIXING_SALES',
    'BAIXING_USER'
  ])
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
