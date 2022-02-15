export const TIMELINE_TYPE_BALANCE = 1
export const TIMELINE_TYPE_CAMPAIGN = 2
export const TIMELINE_TYPE_CREATIVE = 3
export const TIMELINE_TYPE_KEYWORD = 4
export const TIMELINE_TYPE_GROUP = 5
export const TIMELINE_TYPE_UNKNOWN = -1

export const OP_TYPE_CREATE = 1
export const OP_TYPE_UPDATE = 2
export const OP_TYPE_DELETE = 3

export const PRODUCT_TYPE_BIAOWANG = 1
export const PRODUCT_TYPE_FENGMING = 2

export const TYPE_LANDING_PAGE = 11
export const TYPE_CREATIVE_TITLE = 12
export const TYPE_CREATIVE_CONTENT = 13

const fmtOpts = (type) => {
  return Object.freeze(
    Object.entries(type)
      .map(([label, value]) => ({
        label,
        value
      }))
  )
}

export const fengmingTimelineType = {
  // [TIMELINE_TYPE_BALANCE]: '余额',
  不限: '',
  计划: TIMELINE_TYPE_CAMPAIGN,
  单元: TIMELINE_TYPE_GROUP,
  创意: TIMELINE_TYPE_CREATIVE,
  关键词: TIMELINE_TYPE_KEYWORD
}

export const biaowangTimelineType = {
  不限: '',
  落地页: TYPE_LANDING_PAGE,
  创意标题: TYPE_CREATIVE_TITLE,
  创意内容: TYPE_CREATIVE_CONTENT
}

const productType = {
//   标王: PRODUCT_TYPE_BIAOWANG,
  站外推广: PRODUCT_TYPE_FENGMING
}

const opType = {
  不限: '',
  创建: OP_TYPE_CREATE,
  变更: OP_TYPE_UPDATE
}

export const changeLogType = {
  2: '广告投放',
  5: '智能投放'
}

export const fieldType = {
  landingPage: '落地页',
  areas: '投放地域',
  dailyBudget: '日预算',
  mobilePriceRatio: '移动出价比',
  timeRange: '投放时间',
  schedule: '投放时段',
  status: '状态',
  title: '创意标题',
  content: '创意内容',
  word: '关键词',
  price: '关键词出价',
  name: '名称'
}

export const selectType = {
  biaowang: { type: '关键词', placeholder: '请输入关键词' },
  fengming: { type: '计划ID', placeholder: '请输入计划ID' }
}

export const fengmingTimelineTypeOpts = fmtOpts(fengmingTimelineType)
export const biaowangTimelineTypeOpts = fmtOpts(biaowangTimelineType)
export const productTypeOpts = fmtOpts(productType)
export const opTypeOpts = fmtOpts(opType)
