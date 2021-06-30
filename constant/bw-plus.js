import { toOpt } from 'util/kit'

export const PROMOTE_STATUS = {
  待设置: 0,
  待投放: 1,
  投放中: 2,
  已下线: 3
}
export const promoteStatusOpts = toOpt(PROMOTE_STATUS, false, true)

export const AUDIT_STATUS = {
  待审核: 0,
  审核中: 1,
  审核通过: 2,
  审核驳回: 3
}
export const auditStatusOpts = toOpt(AUDIT_STATUS, false, true)

// 查价
export const APPLY_TYPE_NORMAL = 0 // 正常报价
export const APPLY_TYPE_OVERHEAT = 1 // 热度过高
export const APPLY_TYPE_ERROR = 2 // 没有查到热度
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
  [DEVICE_PC]: 'pc',
  [DEVICE_WAP]: 'wap'
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
