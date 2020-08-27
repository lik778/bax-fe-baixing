import {toOpt} from './fengming'

const _AUDIT_STATUS_REJECT_FROM_QUALITY_ROBOT = -11
const _AUDIT_STATUS_REJECT_FROM_QUALITY = -12
const _AUDIT_STATUS_REJECT_FROM_QUALITY_WITH_KEYWORD = -13
const _AUDIT_STATUS_REJECT_FROM_SEM = -14
const _AUDIT_STATUS_NOT_STARTED = 0
const _AUDIT_STATUS_PENDING_QUALITY = 10
const _AUDIT_STATUS_PASSED_QUALITY_ROBOT = 11
const _AUDIT_STATUS_PASSED_QUALITY = 12
const _AUDIT_STATUS_PASSED_SEM = 13

export const AUDIT_STATUS_PENDING_AUDIT = [_AUDIT_STATUS_NOT_STARTED]
export const AUDIT_STATUS_AUDITING = [_AUDIT_STATUS_PENDING_QUALITY, _AUDIT_STATUS_PASSED_QUALITY, _AUDIT_STATUS_PASSED_QUALITY_ROBOT]
export const AUDIT_STATUS_PASS = [_AUDIT_STATUS_PASSED_SEM]
export const AUDIT_STATUS_REJECT = [_AUDIT_STATUS_REJECT_FROM_QUALITY_ROBOT, _AUDIT_STATUS_REJECT_FROM_QUALITY, _AUDIT_STATUS_REJECT_FROM_QUALITY_WITH_KEYWORD, _AUDIT_STATUS_REJECT_FROM_SEM]

export const AUDIT_STATUS = {
  '待审核': AUDIT_STATUS_PENDING_AUDIT,
  '审核中': AUDIT_STATUS_AUDITING,
  '审核通过': AUDIT_STATUS_PASS,
  '审核驳回': AUDIT_STATUS_REJECT
}

export const auditStatusOpts = toOpt(AUDIT_STATUS, false, true)

const _PROMOTE_STATUS_FREEZED = -11
const _PROMOTE_STATUS_CREATED = 0
const _PROMOTE_STATUS_PENDING = 5
const _PROMOTE_STATUS_STARTED = 10
const _PROMOTE_STATUS_FINISHED = 50

export const PROMOTE_STATUS_PENDING_EDIT = [_PROMOTE_STATUS_CREATED]
export const PROMOTE_STATUS_PENDING_ONLINE = [_PROMOTE_STATUS_PENDING]
export const PROMOTE_STATUS_ONLINE = [_PROMOTE_STATUS_STARTED]
export const PROMOTE_STATUS_OFFLINE = [_PROMOTE_STATUS_FINISHED, _PROMOTE_STATUS_FREEZED]

export const PROMOTE_STATUS = {
  '待设置': PROMOTE_STATUS_PENDING_EDIT,
  '待投放': PROMOTE_STATUS_PENDING_ONLINE,
  '投放中': PROMOTE_STATUS_ONLINE,
  '已下线': PROMOTE_STATUS_OFFLINE
}

export const promoteStatusOpts = toOpt(PROMOTE_STATUS, false, true)

export const DEVICE_ALL = 0
export const DEVICE_PC = 1
export const DEVICE_WAP = 2
export const DEVICE = {
  [DEVICE_ALL]: '全平台',
  [DEVICE_PC]: '电脑端',
  [DEVICE_WAP]: '手机端'
}

export const TRADER_TYPE = {
  TRADE_UNPAID: 0,
  TRADE_UNDELIVERED: 1,
  TRADE_DELIVERED: 2,
  TRADE_STOPPED: 30,
  TRADE_STARTED: 31,
  TRADE_MAX_NORMAL_STATUS: 49,
  TRADE_MIN_SUSPENDED_STATUS: 50,
  TRADE_MAX_SUSPENDED_STATUS: 99,
  TRADE_SUSPENDED_UNDELIVERED: 51,
  TRADE_SUSPENDED_DELIVERED: 52,
  TRADE_FINISHED: 100,
  TRADE_CANCELED: 101,
  TRADE_REFUNDED: 102
}

export const TRADE_STATUS = {
  [TRADER_TYPE.TRADE_UNPAID]: '未支付',
  [TRADER_TYPE.TRADE_UNDELIVERED]: '已支付，配送中',
  [TRADER_TYPE.TRADE_DELIVERED]: '送达',
  [TRADER_TYPE.TRADE_STOPPED]: '交易停止',
  [TRADER_TYPE.TRADE_STARTED]: '交易开始',
  [TRADER_TYPE.TRADE_MAX_NORMAL_STATUS]: '正常',
  [TRADER_TYPE.TRADE_MIN_SUSPENDED_STATUS]: '退款中',
  [TRADER_TYPE.TRADE_MAX_SUSPENDED_STATUS]: '退款中',
  [TRADER_TYPE.TRADE_SUSPENDED_UNDELIVERED]: '退款中',
  [TRADER_TYPE.TRADE_SUSPENDED_DELIVERED]: '退款中',
  [TRADER_TYPE.TRADE_FINISHED]: '已结束',
  [TRADER_TYPE.TRADE_CANCELED]: '已取消',
  [TRADER_TYPE.TRADE_REFUNDED]: '已退款'
}

export const PRICE_NEED_MANUAL_QUOTA = 10000 * 100 // 后台以分为单位
export const THIRTY_DAYS = 30
export const NINTY_DAYS = 90
export const HALF_YEAR_DAYS = 180
export const YEAR_DAYS = 360
export const DAYS_MAP = [THIRTY_DAYS, NINTY_DAYS]
export const GET_DAYS_MAP = function(soldType) {
  const isLongOrder = Number(soldType) === SOLD_TYPE_YEAR
  return isLongOrder ? DAYS_MAP.concat([HALF_YEAR_DAYS]): DAYS_MAP
}

export const PROMOTE_OFFERED = 2
export const PROMOTE_UNOFFERED = 1
export const PROMOTE_OFFER_STATUS = {
  [PROMOTE_UNOFFERED]: '未报价',
  [PROMOTE_OFFERED]: '已报价'
}

export const ORDER_APPLY_TYPE_NOT = 0
export const ORDER_APPLY_TYPE_MONTH = 1
export const ORDER_APPLY_TYPE_YEAR = 2

export const APPLY_TYPE_MANUAL_PRICED = 1
export const APPLY_TYPE_ORDER_LONG = 2
export const APPLY_TYPES = {
  [APPLY_TYPE_MANUAL_PRICED]: '人工报价',
  [APPLY_TYPE_ORDER_LONG]: '申请长单'
}

export const SOLD_TYPE_MONTH = 1
export const SOLD_TYPE_YEAR = 2
export const SOLD_TYPES = {
  [SOLD_TYPE_MONTH]: '月单',
  [SOLD_TYPE_YEAR]: '年单'
}