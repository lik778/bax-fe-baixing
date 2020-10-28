// 投放状态
export const PROMOTE_PAID = "PAID"
export const PROMOTE_STATUS_PENDING_EDIT = 'PENDING_EDIT'
export const PROMOTE_STATUS_EDITED = 'EDITED'
export const PROMOTE_STATUS_ONLINE = 'ONLINE'
export const PROMOTE_STATUS_ON_PROMOTE = 'ON_PROMOTE'
export const PROMOTE_STATUS_FINISHED = 'FINISHED'
export const PROMOTE_STATUS_CEASED = 'CEASED'

const PROMOTE_STATUS_EDIT = `${PROMOTE_STATUS_PENDING_EDIT},${PROMOTE_STATUS_EDITED}`

export const PROMOTE_STATUS_MAPPING = {
  [PROMOTE_STATUS_EDIT]: '待编辑物料',
  [PROMOTE_STATUS_ONLINE]: '在线上',
  [PROMOTE_STATUS_ON_PROMOTE]: '投放中',
  [PROMOTE_STATUS_FINISHED]: '已完成',
  [PROMOTE_STATUS_CEASED]: '已停止'
}

export const PROMOTE_STATUS = {
  [PROMOTE_PAID]: '已支付',
  [PROMOTE_STATUS_PENDING_EDIT]: '待编辑物料',
  [PROMOTE_STATUS_EDITED]: '物料已编辑',
  [PROMOTE_STATUS_ONLINE]: '在线上',
  [PROMOTE_STATUS_ON_PROMOTE]: '投放中',
  [PROMOTE_STATUS_FINISHED]: '已完成',
  [PROMOTE_STATUS_CEASED]: '已停止'
}

// 审核状态
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
  UNKNOWN: { value: 'UNKNOWN', label: '未知' },
  CREATED: { value: 'CREATED', label: '创建' },
  PENDING: { value: 'EXPANDING_WORD', label: '待拓词' },
  PENDING_MODIFY_PREFIX_SUFFIX: { value: 'PENDING_MODIFY_PREFIX_SUFFIX', label: '待修改B/D词' },
  PENDING_BIND_USER: { value: 'PENDING_BIND_USER', label: '待绑定用户' },
  PENDING_PAYMENT: { value: 'PENDING_PAYMENT', label: '待支付' },
  PAID: { value: 'PAID', label: '已支付' },
  PENDING_EDIT: { value: 'PENDING_EDIT', label: '待编辑物料' },
  EDITED: { value: 'EDITED', label: '物料已编辑' },
  ONLINE: { value: 'ONLINE', label: '已上线' },
  ON_PROMOTE: { value: 'ON_PROMOTE', label: '投放中' },
  FINISHED: { value: 'FINISHED', label: '已完成' },
  CEASED: { value: 'CEASED', label: '已停止' },
  PAUSED: { value: 'PAUSED', label: '已暂停' }
}
export const UNKNOWN = 'UNKNOWN'
export const DEVICE_ALL = 'ALL'
export const DEVICE_PC = 'PC'
export const DEVICE_WAP = 'WAP'
export const DEVICE = {
  [UNKNOWN]: '未知',
  [DEVICE_ALL]: '全平台',
  [DEVICE_PC]: '电脑端',
  [DEVICE_WAP]: '手机端'
}

export const isExpandWordStatusError = status => [
  EW.PENDING_MODIFY_PREFIX_SUFFIX.value,
  EW.CEASED.value,
  EW.PAUSED.value,
  EW.UNKNOWN.value
].includes(status)
export const EW_OPTIONS = [
  {
    label: '待拓词',
    tip: '系统正在为您优选词，请稍等。',
    value: [
      EW.CREATED.value,
      EW.PENDING.value
    ]
  },
  {
    label: '拓词失败',
    tip: '系统优选词失败，请修改关键词后重新优选。',
    value: [
      EW.PENDING_MODIFY_PREFIX_SUFFIX.value
    ]
  },
  {
    label: '待支付',
    tip: '系统已为你优选关键词，请查看词包详情。',
    value: [
      EW.PENDING_BIND_USER.value,
      EW.PENDING_PAYMENT.value
    ]
  },
  {
    label: '已支付',
    tip: '优选词已支付，请到【管理推广】页面查看。',
    value: [
      EW.PAID.value,
      EW.PENDING_EDIT.value,
      EW.EDITED.value,
      EW.ONLINE.value,
      EW.ON_PROMOTE.value,
      EW.FINISHED.value
    ]
  },
  {
    label: '已停止',
    tip: '支付超时，请重新查词。',
    value: [
      EW.CEASED.value
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
  const handleKey = Object.keys(EW).find(x => {
    return EW[x][key] === val
  })
  handle = EW[handleKey]
  if (handle) return handle
  return {}
}
