
export const LOG_TYPE_CAMPAIGN = 2
export const LOG_TYPE_CREATIVE = 3
export const LOG_TYPE_KEYWORD = 4

export const logType = {
  '0': '账户',
  '1': '账号',
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
