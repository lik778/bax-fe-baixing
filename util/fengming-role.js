import { isPro } from '../config'

import {
  normalizeRoles,
  checkRoles
} from './role'

// 康品汇: 318
// 米勺: 47709
// 优米帮: 860603
// 测试帐号: 53470
// 线下测试账户 17
// 线上测试账户 39

export function allowSee258 (roles, uid) {
  if (isPro) {
    return [2888091, 1847989].includes(uid)
  }
  return [1].includes(uid)
}

export function allowBuyYoucaigouSite (uid) {
  const specialUserIds = [860603, 17, 39]
  return specialUserIds.includes(uid)
}

export function allowSeeQwtPromotion (roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'BAIXING_USER'
  ])
}

export function allowGetOrderPayUrl (roles) {
  const currentRoles = normalizeRoles(roles)

  return checkRoles(currentRoles, [
    'YBS_SALES',
    'BAIXING_SALES'
  ])
}
