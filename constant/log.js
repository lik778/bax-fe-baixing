
export const LOG_TYPE_CAMPAIGN = 2
export const LOG_TYPE_CREATIVE = 3
export const LOG_TYPE_KEYWORD = 4
export const LOG_TYPE_ACCOUNT = 1

const fmtOpts = (type) => {
  return Object.keys(type)
    .map((k) => ({
      label: type[k],
      value: k
    }))
}

export const logType = {
  // '1': '账户',
  '2': '计划',
  '3': '创意',
  '4': '关键词',
  '-1': '其他'
}

const productType = {
  '1': '标王',
  '2': '站外推广',
  '3': '不限'
}

export const changeLogType = {
  '2': '广告投放',
  '5': '智能投放'
}

export const logTypeOpts = fmtOpts(logType)
export const productTypeOpts = fmtOpts(productType)
