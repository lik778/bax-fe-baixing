
import {
  campaignOptimization,
  CAMPAIGN_STATUSES,
  GROUP_STATUSES
} from 'constant/fengming'
const CAMPAIGN_OPTIMIZATION_OPTS = Object.freeze(
  [
    { label: '创意', value: campaignOptimization.STATUS_OPT_CREATIVE },
    { label: '关键词', value: campaignOptimization.STATUS_OPT_KEYWORD },
    { label: '渠道', value: campaignOptimization.STATUS_OPT_SOURCE },
    { label: '出价', value: campaignOptimization.STATUS_OPT_PRICE },
    { label: '投放设置', value: campaignOptimization.STATUS_OPT_SETTING }
  ]
)
const OPTIMIZATION = Object.freeze({
  kwMark: '词',
  priceMark: '价',
  ctrMark: '创',
  defaultMark: '设'
})
const filterOptimization = (row) => {
  const { kwMark, priceMark, ctrMark, defaultMark } = row
  if (kwMark) {
    return '词'
  }
  if (priceMark) {
    return '价'
  }
  if (ctrMark) {
    return '创'
  }
  if (defaultMark) {
    return '设'
  }
  if (!kwMark && !priceMark && !ctrMark && !defaultMark) {
    return '-'
  }
}

// 计划筛选项
const STATUS_OFFLINE = -1 // 计划下线
const STATUS_INVALID_DATE = -50 // 无效的投放期
const STATUS_ACCOUNT_BUDGET_NOT_ENOUGH = -51 // 账户余额不足
const STATUS_INVALID_REGION = -52 // 无效的投放区域
const STATUS_PAUSE = -10 // 计划暂停
// const STATUS_MIGRATE_PAUSE = -11 // 迁框计划暂停
const STATUS_CAMPAIGN_BUDGET_NOT_ENOUGH = 5 // 计划日预算不足
const STATUS_ONLINE = 100 // 计划投放中
const CAMPAIGN_STATUS_OPTS = Object.freeze([
  {
    label: '计划投放中',
    value: STATUS_ONLINE
  },
  {
    label: '无效的投放期',
    value: STATUS_INVALID_DATE
  },
  {
    label: '账户余额不足',
    value: STATUS_ACCOUNT_BUDGET_NOT_ENOUGH
  },
  {
    label: '无效的投放区域',
    value: STATUS_INVALID_REGION
  },
  {
    label: '计划暂停',
    value: STATUS_PAUSE
  },
  {
    label: '计划日预算不足',
    value: STATUS_CAMPAIGN_BUDGET_NOT_ENOUGH
  },
  {
    label: '计划下线',
    value: STATUS_OFFLINE
  }
])

// 单元筛选项
const STATUS_REJECT = -20 // 审核驳回
const GROUP_STATUSES_OPTS = Object.freeze([
  {
    label: '推广中/审核中',
    value: STATUS_ONLINE
  },
  {
    label: '暂停',
    value: STATUS_PAUSE
  },
  {
    label: '审核驳回',
    value: STATUS_REJECT
  },
  {
    label: '下线',
    value: STATUS_OFFLINE
  }
])
// 百度投放平台
const DEVICE = {
  0: '不限',
  1: '移动',
  2: '计算机'
}
export {
  CAMPAIGN_OPTIMIZATION_OPTS,
  CAMPAIGN_STATUS_OPTS,
  GROUP_STATUSES_OPTS,
  OPTIMIZATION,
  CAMPAIGN_STATUSES,
  GROUP_STATUSES,
  STATUS_OFFLINE,
  filterOptimization,
  DEVICE
}
