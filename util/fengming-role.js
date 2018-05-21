
import {
  normalizeRoles,
  checkRoles
} from './role'

// sidebar
// 米勺: 47709
const specialUserIds = [1, 318, 47709, 53470] // 康品汇 特权 自建销售

export function allowSeeGw(roles, uid) {
  return specialUserIds.includes(uid)
}

export function allowSeeQwtCharge(roles, uid) {
  const currentRoles = normalizeRoles(roles)

  if (specialUserIds.includes(uid)) {
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
