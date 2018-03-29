
export const LOG_TYPE_CAMPAIGN = 2
export const LOG_TYPE_CREATIVE = 3
export const LOG_TYPE_KEYWORD = 4
export const LOG_TYPE_ACCOUNT = 1

export const logType = {
  // '1': '账户',
  '2': '计划',
  '3': '创意',
  '4': '关键词',
  '-1': '其他'
}

export const logTypeOpts = Object.keys(logType)
  .map((k) => ({
    label: logType[k],
    value: k
  }))
