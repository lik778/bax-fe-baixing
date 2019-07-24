export const KEYWORD_TYPE_USER = 0
export const KEYWORD_TYPE_RECOMMEND = 1

export const keywordType = {
  [`${KEYWORD_TYPE_USER}`]: '自选词',
  [`${KEYWORD_TYPE_RECOMMEND}`]: '推荐词'
}

export const PLATFORM_PC = 0
export const PLATFORM_WAP = 1

export const platform = {
  [`${PLATFORM_PC}`]: 'PC',
  [`${PLATFORM_WAP}`]: '手机'
}

export const STATUS_UNKOWN = -1
export const STATUS_CREATED = 0
export const STATUS_ONLINE = 1
export const STATUS_PAUSED = 2
export const STATUS_STOPPED = 3
export const STATUS_OFFLINE = 4

export const status = {
  [`${STATUS_UNKOWN}`]: '未知',
  [`${STATUS_CREATED}`]: '待投放',
  [`${STATUS_ONLINE}`]: '在线',
  [`${STATUS_PAUSED}`]: '暂停',
  [`${STATUS_STOPPED}`]: '停止',
  [`${STATUS_OFFLINE}`]: '下线',
}
export const AUDIT_STATUS_UNKNOWN = -1
export const AUDIT_STATUS_PENDING = 0
export const AUDIT_STATUS_PASSED = 1
export const AUDIT_STATUS_REJECTED = 2

export const auditStatus = {
  [`${AUDIT_STATUS_UNKNOWN}`]: "未知",
  [`${AUDIT_STATUS_PENDING}`]: "待审核",
  [`${AUDIT_STATUS_PASSED}`]: "审核通过",
  [`${AUDIT_STATUS_REJECTED}`]: "审核驳回"
}



