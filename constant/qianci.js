// 计划状态
const p = {
  UNKNOWN: 0,
  CREATED: 1,
  EXPAINDG_WORD: 2,
  EXPANDING_WORD_FAILED: 3,
  EXPANDING_WORD_FAILED_LOCKED: 4,
  EXPANDING_WORD_SUCCEED: 5,
  PENDING_PAYMENT: 6,
  UNPAID: 7,
  PAID: 8,
  PENDING_EDIT: 9,
  EDITED: 10,
  REEDITED: 11,
  ONLINE: 12,
  UNPAID_EXPIRED: 13,
  PAYMENT_EXPIRED: 14,
  B2B_AUDIT_FAILED: 15,
  FINISHED: 16,
  CEASED: 17
}
export const promoteStatusMap = p
export const promoteStatusOptions = [
  { value: p.UNKNOWN, uiClass: 'error', label: '未知' },
  { value: p.CREATED, uiClass: '', label: '创建' },
  { value: p.EXPAINDG_WORD, uiClass: '', label: '待拓词' },
  { value: p.EXPANDING_WORD_FAILED, uiClass: 'error', label: '拓词失败' },
  { value: p.EXPANDING_WORD_FAILED_LOCKED, uiClass: '', label: '词已被锁' },
  { value: p.EXPANDING_WORD_SUCCEED, uiClass: '', label: '拓词成功' },
  { value: p.PENDING_PAYMENT, uiClass: '', label: '待支付' },
  { value: p.UNPAID, uiClass: 'error', label: '未支付' },
  { value: p.PAID, uiClass: '', label: '已支付' },
  { value: p.PENDING_EDIT, uiClass: '', label: '待编辑物料' },
  { value: p.EDITED, uiClass: '', label: '物料已编辑' },
  { value: p.REEDITED, uiClass: '', label: '物料再次编辑' },
  { value: p.ONLINE, uiClass: '', label: '已上线' },
  { value: p.UNPAID_EXPIRED, uiClass: 'error', label: '未售过期' },
  { value: p.PAYMENT_EXPIRED, uiClass: 'error', label: '支付超时' },
  { value: p.B2B_AUDIT_FAILED, uiClass: 'error', label: 'b2b审核未通过' },
  { value: p.FINISHED, uiClass: '', label: '已完成' },
  { value: p.CEASED, uiClass: '', label: '已停止' }
]
/**
 * @example
 * getStatusWith('value', row.status).label
 * */
export function getStatusWith(key, val) {
  const handle = promoteStatusOptions.find(x => x[key] === val)
  return handle || {}
}

export function isStatusDisplayError(status) {
  const handle = getStatusWith('value', status)
  return handle.uiClass === 'error'
}
