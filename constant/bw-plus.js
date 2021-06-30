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

export const APPLY_TYPE_NORMAL = 0 // 正常报价
export const APPLY_TYPE_OVERHEAT = 1 // 热度过高
export const APPLY_TYPE_ERROR = 2 // 没有查到热度
export const APPLY_TYPE_ERROR_APPLY_TYPE_OVERHEAT = 3 // 热度过高或热度缺失
export const APPLY_AUDIT_STATUS_PENDING = 0 // 待审核
export const APPLY_AUDIT_STATUS_PASS = 1 // 审核通过
export const APPLY_AUDIT_STATUS_REJECT = 2 // 审核拒绝
export const APPLY_AUDIT_STATUS_OPTIONS = [
  {
    value: APPLY_AUDIT_STATUS_PENDING,
    label: '待审核'
  },
  {
    value: APPLY_AUDIT_STATUS_PASS,
    label: '已审核'
  },
  {
    value: APPLY_AUDIT_STATUS_REJECT,
    label: '审核拒绝'
  }
]
