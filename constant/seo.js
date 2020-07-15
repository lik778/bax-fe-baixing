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
export const STATUS_OFFLINE = 3

export const status = {
  [`${STATUS_UNKOWN}`]: '未知',
  [`${STATUS_CREATED}`]: '待投放',
  [`${STATUS_ONLINE}`]: '在线',
  [`${STATUS_PAUSED}`]: '暂停',
  [`${STATUS_OFFLINE}`]: '下线'
}
export const AUDIT_STATUS_UNKNOWN = -1
export const AUDIT_STATUS_PENDING = 0
export const AUDIT_STATUS_PASSED = 1
export const AUDIT_STATUS_REJECTED = 2

export const auditStatus = {
  [`${AUDIT_STATUS_UNKNOWN}`]: '未知',
  [`${AUDIT_STATUS_PENDING}`]: '待审核',
  [`${AUDIT_STATUS_PASSED}`]: '审核通过',
  [`${AUDIT_STATUS_REJECTED}`]: '审核驳回'
}

export const NINETY_DAYS = 90
export const ONE_HUNDRED_EIGHT_DAYS = 180
export const ONE_YEAR = 365
export const durations = [NINETY_DAYS, ONE_HUNDRED_EIGHT_DAYS, ONE_YEAR]

export const ONE_THROUND_KEYWORD = 1000
export const TWO_THROUND_KEYWORD = 2000
export const FIVE_THROUND_KEYWORD = 5000
export const volumes = [ONE_THROUND_KEYWORD, TWO_THROUND_KEYWORD, FIVE_THROUND_KEYWORD]

export const chargeList = [
  {
    duration: NINETY_DAYS,
    volume: ONE_THROUND_KEYWORD,
    charge: 2988
  },
  {
    duration: NINETY_DAYS,
    volume: TWO_THROUND_KEYWORD,
    charge: 3988
  },
  {
    duration: NINETY_DAYS,
    volume: FIVE_THROUND_KEYWORD,
    charge: 4988
  },
  {
    duration: ONE_HUNDRED_EIGHT_DAYS,
    volume: ONE_THROUND_KEYWORD,
    charge: 5688
  },
  {
    duration: ONE_HUNDRED_EIGHT_DAYS,
    volume: TWO_THROUND_KEYWORD,
    charge: 7688
  },
  {
    duration: ONE_HUNDRED_EIGHT_DAYS,
    volume: FIVE_THROUND_KEYWORD,
    charge: 9688
  },
  {
    duration: ONE_YEAR,
    volume: ONE_THROUND_KEYWORD,
    charge: 10888
  },
  {
    duration: ONE_YEAR,
    volume: TWO_THROUND_KEYWORD,
    charge: 14688
  },
  {
    duration: ONE_YEAR,
    volume: FIVE_THROUND_KEYWORD,
    charge: 18888
  }
]

export const ZIXUAN_TYPE = 1
export const CIBAO_TYPE = 2
export const types = [
  {
    value: CIBAO_TYPE,
    label: '首页宝加速词包计划'
  },
  {
    value: ZIXUAN_TYPE,
    label: '首页宝自选词版计划'
  }
]

export const cibaoStatus = {
  [`${AUDIT_STATUS_UNKNOWN}`]: '未知',
  [`${AUDIT_STATUS_PENDING}`]: '审核中',
  [`${AUDIT_STATUS_PASSED}`]: '投放中',
  [`${AUDIT_STATUS_REJECTED}`]: '已下线'
}

export const BAIDU_TYPE = 0
export const QIHU_360 = 1

export const SKU_GW = 4
export const SKU_GW_100 = 5
export const SKU_GW_200 = 6

export const FREE_UPDATE_NUM_ONE = 1
export const FREE_UPDATE_NUM_ZERO = 0

export const SEARCH_IMAGES_MIN = 0
export const SEARCH_IMAGES_MAX = 40
