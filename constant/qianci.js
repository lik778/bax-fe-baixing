/* TODO refactor */

/* ************************************************* 拓词状态 */
const p = {
  UNKNOWN: 0,
  CREATED: 1,
  EXPANDING_WORD: 2,
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
export const expandingWordStatusMap = p
export const expandingWordStatusOptions = [
  { value: p.UNKNOWN, uiClass: 'error', label: '未知' },
  { value: p.CREATED, uiClass: '', label: '创建' },
  { value: p.EXPANDING_WORD, uiClass: '', label: '待拓词' },
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

export function isExpandingWordStatusDisplayError(status) {
  const handle = getExpandingWordStatusWith('value', status)
  return handle.uiClass === 'error'
}

export const expandingWordDisplayStatusOptions = [
  {
    label: '优选中',
    value: [
      p.EXPANDING_WORD
    ]
  },
  {
    label: '优选失败',
    value: [
      p.EXPANDING_WORD_FAILED
    ]
  },
  {
    label: '优选成功',
    value: [
      p.EXPANDING_WORD_SUCCEED
    ]
  },
  {
    label: '审核拒绝',
    value: [
      p.B2B_AUDIT_FAILED
    ]
  },
  {
    label: '待支付',
    value: [
      p.PENDING_PAYMENT
    ]
  },
  {
    label: '支付超时',
    value: [
      p.PAYMENT_EXPIRED
    ]
  },
  {
    label: '过期',
    value: [
      p.UNPAID_EXPIRED
    ]
  }
]

/**
 * @example
 * getExpandingWordStatusWith('value', row.status).label
 * */
export function getExpandingWordStatusWith(key, val) {
  const handle = expandingWordStatusOptions.find(x => x[key] === val)
  return handle || {}
}
export function getDisplayExpandingWordStatusWith(key, val) {
  let handle = expandingWordDisplayStatusOptions.find(x => {
    return x[key] instanceof Array
      ? x[key].includes(val)
      : x[key] === val
  })
  if (handle) return handle
  handle = getExpandingWordStatusWith(key, val)
  if (handle) return handle
  return {}
}

/* ************************************************* 平台类型枚举 */

export const deviceOptions = [{
  label: '全部',
  value: 0
}, {
  label: '电脑端',
  value: 1
}, {
  label: '手机端',
  value: 2
}]

export const deviceValueLabelMap = {
  0: '电脑、手机',
  1: '电脑端',
  2: '手机端'
}

/* ************************************************* 投放状态 */

export const putInStatusOptions = [
  {
    label: '待设置',
    value: 0
  },
  {
    label: '待投放',
    value: 1
  },
  {
    label: '投放中',
    value: 2
  },
  {
    label: '已下线',
    value: 3
  }
]

export function getPutInStatusWith(key, val) {
  let handle = putInStatusOptions.find(x => {
    return x[key] instanceof Array
      ? x[key].includes(val)
      : x[key] === val
  })
  return handle || {}
}

/* ************************************************* 物料审核状态 */

export const auditStatusOptions = [
  {
    label: '行业待审核',
    value: 0
  },
  {
    label: '行业审核驳回',
    value: 1
  },
  {
    label: '内容待审核',
    value: 2
  },
  {
    label: '内容审核驳回',
    value: 3
  }
]

export function getAuditStatusOptions(key, val) {
  let handle = auditStatusOptions.find(x => {
    return x[key] instanceof Array
      ? x[key].includes(val)
      : x[key] === val
  })
  return handle || {}
}
