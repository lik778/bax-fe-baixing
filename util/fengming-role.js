
import {
  normalizeRoles,
  checkRoles
} from './role'

// 康品汇: 318
// 米勺: 47709
// 优米帮: 860603
// 测试帐号: 53470
const specialUserIds = [318, 47709, 53470]
const specialKaUserIds = [860603]

export function allowSeeOldGw(roles, uid) {
  return specialUserIds.includes(uid)
}

export function allowSeeQwtPromotion(roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'BAIXING_USER'
  ])
}

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
