/* 审核状态 */
export const AUDIT_STATUS_AUDITING_B2B = 'STATUS_AUDITING_B2B'
export const AUDIT_STATUS_REJECT_B2B = 'STATUS_REJECT_B2B'
export const AUDIT_STATUS_PASSED_B2B = 'STATUS_PASSED_B2B'
export const AUDIT_STATUS_AUDITING_SUPPLIES = 'STATUS_AUDITING_SUPPLIES'
export const AUDIT_STATUS_REJECT_SUPPLIES = 'STATUS_REJECT_SUPPLIES'
export const AUDIT_STATUS_PASSED_SUPPLIES = 'STATUS_PASSED_SUPPLIES'
export const AUDIT_STATUS_AUDITING_SEM = 'STATUS_AUDITING_SEM'
export const AUDIT_STATUS_REJECT_SEM = 'STATUS_REJECT_SEM'
export const AUDIT_STATUS_PASSED_SEM = 'STATUS_PASSED_SEM'
export const AUDIT_STATUS_MAPPING = {
  [AUDIT_STATUS_AUDITING_B2B]: 'B2B词审核中',
  [AUDIT_STATUS_REJECT_B2B]: 'B2B词审核不通过',
  [AUDIT_STATUS_PASSED_B2B]: 'B2B词审核通过',
  [AUDIT_STATUS_AUDITING_SUPPLIES]: '物料审核中',
  [AUDIT_STATUS_REJECT_SUPPLIES]: '物料审核不通过',
  [AUDIT_STATUS_PASSED_SUPPLIES]: '物料审核通过',
  [AUDIT_STATUS_AUDITING_SEM]: 'sem代理商审核中',
  [AUDIT_STATUS_REJECT_SEM]: 'sem代理商审核不通过',
  [AUDIT_STATUS_PASSED_SEM]: 'sem代理商审核通过'
}

/* 拓词状态 */
export const EW = {
  CREATED: { value: 'CREATED', label: '创建' },
  PENDING: { value: 'EXPANDING_WORD', label: '待拓词' },
  PENDING_MODIFY_PREFIX_SUFFIX: { value: 'PENDING_MODIFY_PREFIX_SUFFIX', label: '待修改B/D词' },
  PENDING_BIND_USER: { value: 'PENDING_BIND_USER', label: '待绑定用户' },
  PENDING_PAYMENT: { value: 'PENDING_PAYMENT', label: '待支付' },
  PAID: { value: 'PAID', label: '已支付' }
}
export const isExpandWordStatusError = status => status === EW.PENDING_MODIFY_PREFIX_SUFFIX.value
export const EW_OPTIONS = [
  {
    label: '待拓词',
    value: [
      EW.CREATED.value,
      EW.PENDING.value
    ]
  },
  {
    label: '拓词失败',
    value: [
      EW.PENDING_MODIFY_PREFIX_SUFFIX.value
    ]
  },
  {
    label: '待支付',
    value: [
      EW.PENDING_BIND_USER.value,
      EW.PENDING_PAYMENT.value
    ]
  },
  {
    label: '已支付',
    value: [
      EW.PAID.value
    ]
  }
]
export function getEWStatusWith(key, val) {
  let handle = EW_OPTIONS.find(x => {
    return x[key] instanceof Array
      ? x[key].includes(val)
      : x[key] === val
  })
  if (handle) return handle
  const handleKey = Object.keys(EW).find(key => {
    return EW[key][key] === val
  })
  handle = EW[handleKey]
  if (handle) return handle
  return {}
}
