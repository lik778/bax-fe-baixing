export const TIMELINE_TYPE_BALANCE = 1
export const TIMELINE_TYPE_CAMPAIGN = 2
export const TIMELINE_TYPE_CREATIVE = 3
export const TIMELINE_TYPE_KEYWORD = 4
export const TIMELINE_TYPE_UNKNOWN = -1

export const OP_TYPE_CREATE = 1
export const OP_TYPE_UPDATE = 2
export const OP_TYPE_DELETE = 3

const fmtOpts = (type) => {
  return Object.freeze(
    Object.entries(type)
      .map(([label, value]) => ({
        label,
        value
      }))
  )
}

export const timelineType = {
  // [TIMELINE_TYPE_BALANCE]: '余额',
  '不限': '',
  '计划': TIMELINE_TYPE_CAMPAIGN,
  '创意': TIMELINE_TYPE_CREATIVE,
  '关键词': TIMELINE_TYPE_KEYWORD
}

const productType = {
  '3': '不限',
  '1': '标王',
  '2': '站外推广'
}

const opType = {
  '不限': '',
  '创建': OP_TYPE_CREATE,
  '变更': OP_TYPE_UPDATE
}

export const changeLogType = {
  '2': '广告投放',
  '5': '智能投放'
}

export const fieldType = {
  title: '创意标题',
  price: '价格',
  dailyBudget: '日预算'
}

export const timelineTypeOpts = fmtOpts(timelineType)
export const productTypeOpts = fmtOpts(productType)
export const opTypeOpts = fmtOpts(opType)
