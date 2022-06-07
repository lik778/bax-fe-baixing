import { toOpt } from 'util/kit'

/**
 * 赤壁状态对用户不可知
 *   - 关键词, 创意, 推广
 */
export const KEYWORD_CHIBI_REJECT = -10 // 审核失败 (关键词 直接删除)
export const KEYWORD_CHIBI_PENDING = 0
export const KEYWORD_CHIBI_ACCEPT = 10

export const CREATIVE_CHIBI_REJECT = -20
export const CREATIVE_CHIBI_PENDING = 0
export const CREATIVE_CHIBI_TITLE_PENDING = 1
export const CREATIVE_CHIBI_CONTENT_PENDING = 2
export const CREATIVE_CHIBI_ACCEPT = 10

export const KEYWORD_STATUS_REFUSE = -10
export const KEYWORD_STATUS_ONLINE = 0

// 优选推店铺状态枚举
export const mvipShopStatus = {
  0: 'INIT',
  1: 'ONLINE',
  2: 'OFFLINE_SENSITIVE',
  3: 'DELETE',
  4: 'OFFLINE_SHOP_OPERATION',
  5: 'REFUND',
  6: 'EXPIRED'
}
export const isMvipShopStatusValid = ss => [mvipShopStatus[0], mvipShopStatus[1]].includes(ss)

// 针对用户显示做了简化
export const keywordStatus = {
  0: '投放中',
  '-1': '已删除',
  1: '审核中',
  5: '审核中',
  6: '已删除',
  7: '审核中',
  '-10': '审核驳回'
}

export const semPlatform = {
  0: 'baidu',
  1: 'qihu',
  3: 'baidu test',
  4: 'qihu test',
  5: 'sogou',
  8: 'shenma'
}

export const SEM_PLATFORM_BAIDU = 0
export const SEM_PLATFORM_QIHU = 1
export const SEM_PLATFORM_SOGOU = 5
export const SEM_PLATFORM_SHENMA = 8

export const semPlatformCn = {
  0: '百度',
  1: '360',
  3: '百度测试',
  4: '360测试',
  5: '搜狗',
  8: '神马'
}

export const semPlatformOpts = [{
  label: '百度',
  value: 0
}, {
  label: '搜狗',
  value: 5
}, {
  label: '360',
  value: 1
}, {
  label: '神马',
  value: 8
}]

export const CREATIVE_STATUS_PENDING = 0
export const CREATIVE_STATUS_REJECT = -10

export const creativeStatus = {
  '-10': '审核失败',
  '-1': '下线',
  0: '等待审核',
  10: '推广中'
}

export const expectedBudget = {
  1: '50以下',
  2: '51-100',
  3: '101-400',
  4: '401-700',
  5: '701-1000',
  6: '1001以上'
}

export const expectedBudgetOpts = toOpt(expectedBudget)

export const optType = {
  1: '关键词',
  2: '创意',
  3: '其他'
}

export const optTypeOpts = toOpt(optType)

export const LANDING_TYPE_AD = 0
export const LANDING_TYPE_GW = 1
export const LANDING_TYPE_WESHOP = 2
export const LANDING_TYPE_258 = 5
export const LANDING_TYPE_STORE = 6
export const LANDING_TYPE_BAIDU_JIMUYU = 7 // 百度基木鱼

export const landingType = {
  // [`${LANDING_TYPE_AD}`]: '帖子',
  [`${LANDING_TYPE_STORE}`]: '店铺'
}

export const bwlandingType = {
  // [`${LANDING_TYPE_AD}`]: '帖子',
  [`${LANDING_TYPE_STORE}`]: '店铺'
}

export const campaignOptimization = {
  STATUS_REJECT: -53,
  STATUS_OPT_SOURCE: 101,
  STATUS_OPT_CREATIVE: 102,
  STATUS_OPT_PRICE: 103,
  STATUS_OPT_SETTING: 104,
  STATUS_OPT_KEYWORD: 105
}

export const landingTypeOpts = toOpt(landingType)
export const bwlandingTypeOpts = toOpt(bwlandingType)

export const DEVICE_WAP = 1
export const DEVICE_PC = 0

export const device = {
  0: 'PC',
  1: 'WAP'
}

export const MIN_DAILY_BUDGET = 100

export const TIME_TYPE_CUSTOM = 'custom'
export const TIME_TYPE_LONG = 'long'
export const TIME_TYPE_OPTS = {
  [TIME_TYPE_LONG]: '长期投放',
  [TIME_TYPE_CUSTOM]: '定时投放'
}

export const DURATION_TYPE_ALL = 'all'
export const DURATION_TYPE_PART = 'part'
export const SOGOU_MAX_DURATION = 3670009
export const EXCLUDE_SOGOU_MAX_DURATION = 117440505
export const DURATION_TYPE_OPTS = {
  [DURATION_TYPE_ALL]: '全时段',
  [DURATION_TYPE_PART]: '部分时段'
}

export const NEGATIVE_KEYWORDS_MAX = 200
export const NEGATIVE_KEYWORDS_SOGOU_MAX = 50
export const NEGATIVE_KEYWORDS_SHENMA_MAX = 600

export const RECOMMAND_SOURCE_FH = 'tfidf_fh'
export const NEW_RECOMMAND_SOURCE_FH = 'tfidf_fh_service'

export const RECOMMAND_SOURCES = [NEW_RECOMMAND_SOURCE_FH, RECOMMAND_SOURCE_FH]

export const MATCH_TYPE_EXACT = 1
export const MATCH_TYPE_PHRASE = 2
export const MATCH_TYPE_SMART = 3

export const MATCH_TYPE_OPTS = [
  {
    label: '短语匹配',
    value: MATCH_TYPE_PHRASE
  },
  {
    label: '智能匹配',
    value: MATCH_TYPE_SMART
  },
  {
    label: '精准匹配',
    value: MATCH_TYPE_EXACT
  }
]

// fm精准匹配策略
export const matchTypeTipAndCount = [
  {
    minKeywordCount: 0,
    maxKeywordCount: 19,
    errTip: '计划中关键词数不足20，提升至20个以上时可设置精确匹配',
    count: () => {
      return 0
    }
  },
  {
    minKeywordCount: 20,
    maxKeywordCount: 89,
    errTip: '精确匹配的设置数量已超过系统限制，更改失败。',
    count: (wordLen) => {
      return Math.ceil(wordLen * 0.1)
    }
  },
  {
    minKeywordCount: 90,
    maxKeywordCount: 10000000,
    errTip: '精确匹配的设置数量已超过系统限制，更改失败。',
    count: () => {
      return 10
    }
  }
]
// 针对特殊代理商和用户的精确匹配逻辑
export const matchTypeTipAndCountSpecial = {
  minKeywordCount: 2,
  maxKeywordCount: 10000000,
  errTip: '精确匹配的设置数量已超过系统限制，更改失败。',
  count: (wordLen) => {
    return Math.ceil(wordLen * 0.5)
  }
}

export const getMatchTypeObj = (wordLen, special) => {
  if (!special) {
    const tempObj = matchTypeTipAndCount.find(o => wordLen >= o.minKeywordCount && wordLen <= o.maxKeywordCount)
    return tempObj || matchTypeTipAndCount[0]
  } else {
    return matchTypeTipAndCountSpecial
  }
}

export function filterBannedListByContent (words) {
  const normalList = words.map(w => ({
    id: w,
    word: w,
    content: w
  }))
  return {
    bannedList: [],
    normalList
  }
}

export const emptyGroup = {
  landingType: 0,
  landingPage: '',
  landingPageId: '',
  name: '',
  creatives: [{
    title: '',
    content: ''
  }],
  negativeWords: [],
  mobilePriceRatio: 1,
  keywords: [],
  price: 2
}

export const KEYWORDS_MAX = 5000

export const FHYF_USERD = 1
export const FHYF_UN_USE = 0

export const GROUP_MAX = 10

/* 计划状态 - 对应数据库 status 字段状态 */
export const RAW_CAMPAIN_STATUS = {
  // 计划下线
  STATUS_OFFLINE: -1,
  // 无效的投放期
  STATUS_INVALID_DATE: -50,
  // 账户余额不足
  STATUS_ACCOUNT_BUDGET_NOT_ENOUGH: -51,
  // 无效的投放区域
  STATUS_INVALID_REGION: -52,
  // 计划暂停
  STATUS_PAUSE: -10,
  // 迁框计划暂停
  STATUS_MIGRATE_PAUSE: -11,
  // 计划日预算不足
  STATUS_CAMPAIGN_BUDGET_NOT_ENOUGH: 5,
  // 计划投放中
  STATUS_ONLINE: 100
}

/* 单元状态 - 对应数据库 status 字段状态 */
export const RAW_GROUP_STATUS = {
  // 下线
  STATUS_OFFLINE: -1,
  // 暂停
  STATUS_PAUSE: -10,
  // 有效
  STATUS_ONLINE: 100
}

/* 计划状态 - 后端包装过一层的状态 */

export const CAMPAIGN_STATUS_ONLINE = 1
export const CAMPAIGN_STATUS_OFFLINE = 2
export const CAMPAIGN_STATUS_PAUSE = 3
export const CAMPAIGN_STATUS_ACCOUNT_BUDGET_NOT_ENOUGH = 4
export const CAMPAIGN_STATUS_CAMPAIGN_BUDGET_NOT_ENOUGH = 5
export const CAMPAIGN_STATUS_INVALID_DATE = 6
export const CAMPAIGN_STATUS_INVALID_AREAS = 7

export const CAMPAIGN_STATUSES = {
  [CAMPAIGN_STATUS_ONLINE]: {
    label: '投放中',
    type: 'success'
  },
  [CAMPAIGN_STATUS_OFFLINE]: {
    label: '下线',
    type: 'danger'
  },
  [CAMPAIGN_STATUS_PAUSE]: {
    label: '暂停',
    type: 'warning'
  },
  [CAMPAIGN_STATUS_ACCOUNT_BUDGET_NOT_ENOUGH]: {
    label: '余额不足',
    type: 'warning'
  },
  [CAMPAIGN_STATUS_CAMPAIGN_BUDGET_NOT_ENOUGH]: {
    label: '日预算不足',
    type: 'warning'
  },
  [CAMPAIGN_STATUS_INVALID_DATE]: {
    label: '非投放时间',
    type: 'warning'
  },
  [CAMPAIGN_STATUS_INVALID_AREAS]: {
    label: '非投放区域',
    type: 'warning'
  }
}

/**
 * 单元状态
 */
export const GROUP_STATUS_ONLINE = 1
export const GROUP_STATUS_OFFLINE = 2
export const GROUP_STATUS_PAUSE = 3
export const GROUP_STATUS_PENDING_AUDIT = 4
export const GROUP_STATUS_REJECT = 5

export const GROUP_STATUSES = {
  [GROUP_STATUS_ONLINE]: {
    label: '有效',
    type: 'success'
  },
  [GROUP_STATUS_OFFLINE]: {
    label: '下线',
    type: 'danger'
  },
  [GROUP_STATUS_PAUSE]: {
    label: '暂停',
    type: 'warning'
  },
  [GROUP_STATUS_PENDING_AUDIT]: {
    label: '审核中',
    type: 'warning'
  },
  [GROUP_STATUS_REJECT]: {
    label: '审核驳回',
    type: 'danger'
  }
}

// 关键词状态 - 对应数据库 status 字段状态
export const RAW_KEYWORD_STATUS = {
  ONLINE: 0,
  OFFLINE: -1,
  FAILED: -10,
  PENDING: 1,
  SEM_PENDING_CREATE: 5,
  SEM_PENDING_DELETE: 6,
  SEM_PENDING_UPDATE: 7,
  SEM_PENDING_ADJUST: 8,
  UNKNOWN: 10
}
export const isDeletedKeyword = status => [
  RAW_KEYWORD_STATUS.OFFLINE,
  RAW_KEYWORD_STATUS.SEM_PENDING_DELETE
].includes(status)

// 物料图片类型枚举
export const MATERIAL_PIC_TYPE = {
  NO_PIC: 0,
  BIG_PIC: 1,
  PIC_SETS: 2
}

// 物料图片状态枚举
export const MATERIAL_PIC_STATUS = {
  STATUS_PENDING_CHIBI: 1,
  STATUS_CHIBI_AUDITING: 2,
  STATUS_PENDING_CREATE: 11,
  STATUS_AUDITING: 13,
  STATUS_CHIBI_REJECT: -10,
  STATUS_AUDIT_REJECT: 5,
  STATUS_PENDING_DELETE: -2,
  STATUS_DELETED: -1,
  STATUS_ONLINE: 0,
  STATUS_CASCADE_OFFLINE: 3
}

// 物料图片审核类型枚举
export const MATERIAL_PIC_AUDIT_TYPE = {
  AUDITING: [
    MATERIAL_PIC_STATUS.STATUS_PENDING_CHIBI,
    MATERIAL_PIC_STATUS.STATUS_CHIBI_AUDITING,
    MATERIAL_PIC_STATUS.STATUS_PENDING_CREATE,
    MATERIAL_PIC_STATUS.STATUS_AUDITING
  ],
  FAILED: [
    MATERIAL_PIC_STATUS.STATUS_CHIBI_REJECT,
    MATERIAL_PIC_STATUS.STATUS_AUDIT_REJECT
  ],
  ONLINE: [
    MATERIAL_PIC_STATUS.STATUS_ONLINE
  ],
  OFFLINE: [
    MATERIAL_PIC_STATUS.STATUS_CASCADE_OFFLINE
  ]
}

// 拿到url上的query 对应的value
export const getQueryParams = (key) => {
  const query = window.location.search.substring(1).split('&')
  for (const item of query) {
    const cur = item.split('=')
    if (cur[0] === key) {
      return cur[1]
    }
  }
}
