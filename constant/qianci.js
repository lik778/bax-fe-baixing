import { toOpt } from 'util/kit'

// 投放状态
export const PROMOTE_PAID = 'PAID'
export const PROMOTE_STATUS_PENDING_EDIT = 'PENDING_EDIT'
export const PROMOTE_STATUS_EDITED = 'EDITED'
export const PROMOTE_STATUS_ONLINE = 'ONLINE'
export const PROMOTE_STATUS_ON_PROMOTE = 'ON_PROMOTE'
export const PROMOTE_STATUS_FINISHED = 'FINISHED'
export const PROMOTE_STATUS_CEASED = 'CEASED'
export const PROMOTE_STATUS_PAUSED = 'PAUSED'

export const PROMOTE_STATUS_MAPPING = {
  [PROMOTE_STATUS_PENDING_EDIT]: '待编辑物料',
  [PROMOTE_STATUS_EDITED]: '物料已编辑',
  [PROMOTE_STATUS_ONLINE]: '在线上',
  [PROMOTE_STATUS_ON_PROMOTE]: '投放中',
  [PROMOTE_STATUS_FINISHED]: '已完成',
  [PROMOTE_STATUS_CEASED]: '已停止',
  [PROMOTE_STATUS_PAUSED]: '已暂停'
}

export const PROMOTE_STATUS = {
  [PROMOTE_PAID]: '已支付',
  ...PROMOTE_STATUS_MAPPING
}

// 审核状态
export const AUDIT_STATUS_UNKNOWN = 'STATUS_UNKNOWN'
export const AUDIT_STATUS_EMPTY = 'STATUS_EMPTY'
export const AUDIT_STATUS_AUDITING_B2B = 'STATUS_AUDITING_B2B'
export const AUDIT_STATUS_REJECT_B2B = 'STATUS_REJECT_B2B'
export const AUDIT_STATUS_PASSED_B2B = 'STATUS_PASSED_B2B'
export const AUDIT_STATUS_AUDITING_SUPPLIES = 'STATUS_AUDITING_SUPPLIES'
export const AUDIT_STATUS_REJECT_SUPPLIES = 'STATUS_REJECT_SUPPLIES'
export const AUDIT_STATUS_REJECT_KEYWORD = 'STATUS_REJECT_KEYWORD'
export const AUDIT_STATUS_PASSED_SUPPLIES = 'STATUS_PASSED_SUPPLIES'
export const AUDIT_STATUS_AUDITING_SEM = 'STATUS_AUDITING_SEM'
export const AUDIT_STATUS_REJECT_SEM = 'STATUS_REJECT_SEM'
export const AUDIT_STATUS_PASSED_SEM = 'STATUS_PASSED_SEM'
export const AUDIT_STATUS_MAPPING = {
  [AUDIT_STATUS_UNKNOWN]: '未知',
  [AUDIT_STATUS_EMPTY]: '未审核',
  [AUDIT_STATUS_AUDITING_B2B]: 'B2B词审核中',
  [AUDIT_STATUS_REJECT_B2B]: 'B2B词审核不通过',
  [AUDIT_STATUS_PASSED_B2B]: 'B2B词审核通过',
  [AUDIT_STATUS_AUDITING_SUPPLIES]: '物料审核中',
  [AUDIT_STATUS_REJECT_SUPPLIES]: '物料审核不通过',
  [AUDIT_STATUS_REJECT_KEYWORD]: '关键词审核不通过',
  [AUDIT_STATUS_PASSED_SUPPLIES]: '物料审核通过',
  [AUDIT_STATUS_AUDITING_SEM]: 'sem代理商审核中',
  [AUDIT_STATUS_REJECT_SEM]: 'sem代理商审核不通过',
  [AUDIT_STATUS_PASSED_SEM]: 'sem代理商审核通过'
}
// 91投放状态
export const SEO_STATUS_UNBUY = 'UNBUY'
export const SEO_STATUS_BOUGHT = 'BOUGHT'
export const SEO_STATUS_CANCELED = 'CANCELED'
export const SEO_STATUS_EXPIRED = 'EXPIRED'

export const SEO_STATUS_MAPPING = {
  [SEO_STATUS_UNBUY]: '未购买',
  [SEO_STATUS_BOUGHT]: '已购买',
  [SEO_STATUS_CANCELED]: '取消',
  [SEO_STATUS_EXPIRED]: '过期'
}

export const AUDIT_STATUS_OPTIONS = [
  {
    label: 'B2B审核中',
    values: [AUDIT_STATUS_AUDITING_B2B],
    showAuditFailReason: false
  },
  {
    label: 'B2B词审核通过',
    values: [AUDIT_STATUS_PASSED_B2B],
    showAuditFailReason: false
  },
  {
    label: '审核中',
    values: [
      AUDIT_STATUS_AUDITING_SUPPLIES,
      AUDIT_STATUS_PASSED_SUPPLIES,
      AUDIT_STATUS_AUDITING_SEM
    ],
    showAuditFailReason: false
  },
  {
    label: '审核不通过',
    values: [
      AUDIT_STATUS_REJECT_B2B,
      AUDIT_STATUS_REJECT_SUPPLIES,
      AUDIT_STATUS_REJECT_KEYWORD,
      AUDIT_STATUS_REJECT_SEM
    ],
    showAuditFailReason: true
  },
  {
    label: '审核通过',
    values: [AUDIT_STATUS_PASSED_SEM],
    showAuditFailReason: false
  }
]

export function getPromoteAuditStatus (key, val) {
  const handle = AUDIT_STATUS_OPTIONS.find((x) => {
    return x[key] instanceof Array ? x[key].includes(val) : x[key] === val
  })
  if (handle) return handle
  return {}
}

/* 拓词状态 */
export const EW = {
  UNKNOWN: { value: 'UNKNOWN', label: '未知' },
  CREATED: { value: 'CREATED', label: '创建' },
  PENDING: { value: 'EXPANDING_WORD', label: '待拓词' },
  PENDING_MODIFY_PREFIX_SUFFIX: {
    value: 'PENDING_MODIFY_PREFIX_SUFFIX',
    label: '待修改B/D词'
  },
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

export const DEVICE_DASHBOARD_WAP = 1
export const DEVICE_DASHBOARD_WEB = 2
export const DEVICE_DASHBOARD = {
  [DEVICE_DASHBOARD_WAP]: '电脑端',
  [DEVICE_DASHBOARD_WEB]: '手机端'
}

export const isExpandWordStatusError = (status) =>
  [
    EW.PENDING_MODIFY_PREFIX_SUFFIX.value,
    EW.CEASED.value,
    EW.PAUSED.value,
    EW.UNKNOWN.value
  ].includes(status)
export const EW_OPTIONS = [
  {
    label: '待拓词',
    tip: '系统正在为您优选词，请稍等。',
    value: [EW.CREATED.value, EW.PENDING.value]
  },
  {
    label: '拓词失败',
    tip: '系统优选词失败，请修改关键词后重新优选。',
    value: [EW.PENDING_MODIFY_PREFIX_SUFFIX.value]
  },
  {
    label: '待支付',
    tip: '系统已为你优选关键词，请查看词包详情。',
    value: [EW.PENDING_BIND_USER.value, EW.PENDING_PAYMENT.value]
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
    value: [EW.CEASED.value]
  }
]
export function getEWStatusWith (key, val) {
  let handle = EW_OPTIONS.find((x) => {
    return x[key] instanceof Array ? x[key].includes(val) : x[key] === val
  })
  if (handle) return handle
  const handleKey = Object.keys(EW).find((x) => {
    return EW[x][key] === val
  })
  handle = EW[handleKey]
  if (handle) return handle
  return {}
}

// 千词编辑物料落地页默认 type
export const LANDING_TYPE_GUAN_WANG = 'GUAN_WANG'
export const LANDING_TYPE_STORE = 'SHOP_SITE'

export const landingType = {
  [`${LANDING_TYPE_STORE}`]: '店铺'
}

export const landingTypeOpts = toOpt(landingType, false)

/* 千词套餐类型 */
export const ONE_WORD_TWO_PROVINCE = 'ONE_WORD_TWO_PROVINCE'
export const THREE_WORD_ONE_PROVINCE = 'THREE_WORD_ONE_PROVINCE'
export const PACKAGE_TYPE = {
  [ONE_WORD_TWO_PROVINCE]: '两省一词',
  [THREE_WORD_ONE_PROVINCE]: '一省三词'
}

export const SEO_WAN_CI_91 = 'WAN_CI_91'
export const SEO_QIAN_CI_INSTATION = 'QIAN_CI_INSTATION'

export const SKU_OPTIMIZED = 1
export const SKU_EXPERIENCE = 2
