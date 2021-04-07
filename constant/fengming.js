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

export const CAMPAIGN_AUDIT_AUTHING = 0
export const CAMPAIGN_AUDIT_OFFLINE = -1

export const campaignAuditStatus = {
  '-10': '审核驳回',
  '-1': '下线',
  0: '审核中',
  10: '审核通过'
}

export const campaignStatus = {
  100: '有效',
  5: '计划预算不足',
  0: '审核中', // mvp
  '-1': '下线',
  '-10': '暂停投放',
  '-50': '不在投放期',
  '-51': '账户余额不足'
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

export const CAMPAIGN_STATUS_PAUSE = -10
export const CAMPAIGN_STATUS_OFFLINE = -1
export const CAMPAIGN_STATUS_ONLINE = 100
export const CAMPAIGN_STATUS_ACCOUNT_BUDGET_NOT_ENOUGH = -51
export const CAMPAIGN_STATUS_CAMPAIGN_BUDGET_NOT_ENOUGH = 5

export const LANDING_TYPE_AD = 0
export const LANDING_TYPE_GW = 1
export const LANDING_TYPE_258 = 5
export const LANDING_TYPE_STORE = 6

export const landingType = {
  [`${LANDING_TYPE_AD}`]: '帖子',
  [`${LANDING_TYPE_GW}`]: '官网',
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

export const campaignStatusOpts = toOpt(campaignStatus)

export const landingTypeOpts = toOpt(landingType)

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
    maxKeywordCount: 29,
    errTip: '计划中关键词数不足30，提升至30个以上时可设置精确匹配',
    count: () => {
      return 0
    }
  },
  {
    minKeywordCount: 30,
    maxKeywordCount: 99,
    errTip: '精确匹配的设置数量已超过系统限制，更改失败。',
    count: (wordLen) => {
      return Math.ceil(wordLen * 0.1)
    }
  },
  {
    minKeywordCount: 100,
    maxKeywordCount: 10000000,
    errTip: '精确匹配的设置数量已超过系统限制，更改失败。',
    count: () => {
      return 10
    }
  }
]

export const getMatchTypeObj = (wordLen) => {
  const tempObj = matchTypeTipAndCount.find(o => wordLen >= o.minKeywordCount && wordLen <= o.maxKeywordCount)
  return tempObj || matchTypeTipAndCount[0]
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
  status: '',
  creatives: [{
    title: '',
    content: ''
  }],
  negativeWords: [],
  mobilePriceRatio: 1,
  keywords: [],
  price: 2
}
