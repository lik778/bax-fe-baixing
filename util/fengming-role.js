import {isPro} from '../config'

import {
  normalizeRoles,
  checkRoles
} from './role'

// 康品汇: 318
// 米勺: 47709
// 优米帮: 860603
// 测试帐号: 53470

export function allowSeeOldGw(roles, uid) {
  // 318, 47709, 53470
  const specialUserIds = [] // 这几个挺牛逼, 能买 老官网
  return specialUserIds.includes(uid)
}

export function allowSee258(roles, uid) {
  if (isPro) {
    return [2888091, 1847989].includes(uid)
  }
  return [303].includes(uid)
}

export function allowUseKaPackage(roles, uid) {
  const specialKaUserIds = [860603, 318, 47709, 53470] // 这几个比较牛逼, 特价 (1000) 买官网
  return specialKaUserIds.includes(uid)
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
