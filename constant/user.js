export const logType = {
  '0': '账户',
  '1': '账号',
  '2': '计划'
}
export const logTypeOpts = Object.keys(logType)
  .map((k) => ({
    label: logType[k],
    value: k
  }))
