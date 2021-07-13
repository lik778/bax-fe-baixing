// 审核状态
export const AUDIT_STATUS_PENGDING = 0
export const AUDIT_STATUS_AUDITING = 5
export const AUDIT_STATUS_PASS = 10
export const AUDIT_STATUS_REJECT = 2
export const AUDIT_STATUS_MAP = {
  [AUDIT_STATUS_PENGDING]: '待审核',
  [AUDIT_STATUS_AUDITING]: '审核中',
  [AUDIT_STATUS_PASS]: '审核通过',
  [AUDIT_STATUS_REJECT]: '审核驳回'
}
export const AUDIT_STATUS_COLOR_MAP = {
  [AUDIT_STATUS_PENGDING]: 'info',
  [AUDIT_STATUS_AUDITING]: 'info',
  [AUDIT_STATUS_PASS]: 'success',
  [AUDIT_STATUS_REJECT]: 'warning'
}

// 计划状态
export const PROMOTE_STATUS_PENDING_EDIT = 0
export const PROMOTE_STATUS_PENDING_ONLINE = 5
export const PROMOTE_STATUS_ONLINE = 10
export const PROMOTE_STATUS_OFFLINE = 50
export const PROMOTE_STATUS_MAP = {
  [PROMOTE_STATUS_PENDING_EDIT]: '待设置',
  [PROMOTE_STATUS_PENDING_ONLINE]: '待投放',
  [PROMOTE_STATUS_ONLINE]: '投放中',
  [PROMOTE_STATUS_OFFLINE]: '已下线'
}
export const PROMOTE_STATUS_COLOR_MAP = {
  [PROMOTE_STATUS_PENDING_EDIT]: 'info',
  [PROMOTE_STATUS_PENDING_ONLINE]: 'info',
  [PROMOTE_STATUS_ONLINE]: 'success',
  [PROMOTE_STATUS_OFFLINE]: 'warning'
}

// 查价
export const APPLY_TYPE_NORMAL = 0 // 正常报价
export const APPLY_TYPE_ERROR = 1 // 非正常报价
export const APPLY_TYPE_ERROR_APPLY_TYPE_OVERHEAT = 3 // 热度过高或热度缺失
export const APPLY_AUDIT_STATUS_PENDING = 0 // 待审核
export const APPLY_AUDIT_STATUS_PASS = 1 // 审核通过
export const APPLY_AUDIT_STATUS_REJECT = 2 // 审核拒绝

export const APPLY_AUDIT_STATUS_OPTIONS = Object.freeze({
  [APPLY_AUDIT_STATUS_PENDING]: '待审核',
  [APPLY_AUDIT_STATUS_PASS]: '已审核',
  [APPLY_AUDIT_STATUS_REJECT]: '审核拒绝'
})

export const DEVICE_ALL = 0 // 全平台
export const DEVICE_PC = 1 // pc
export const DEVICE_WAP = 2 // wap
export const DEVICE = Object.freeze({
  [DEVICE_ALL]: '全平台',
  [DEVICE_PC]: '电脑',
  [DEVICE_WAP]: '手机'
})
export const SCHEDULE_TYPE = Object.freeze({
  58: '5天*8小时',
  724: '7天*24小时'
})
export const SERVICE_DAYS = Object.freeze({
  360: '360天',
  180: '180天',
  90: '90天',
  30: '30天'
})
export const THIRTY_DAYS = 30
