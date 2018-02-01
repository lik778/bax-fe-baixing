
export const DIMENSION_CAMPAIGN = 0
export const DIMENSION_KEYWORD = 1
export const DIMENSION_NONE = 2 // 这是啥意思 ? @嘟嘟噜

export const CSV_REPORT_GENERATING = 0 // 生成中
export const CSV_REPORT_FINISHED = 2 // 完成
export const CSV_REPORT_EMPTY = 1 // 无数据

export const csvReportStatus = {
  '0': '生成中',
  '1': '无数据',
  '2': '已生成'
}

export const allDimensions = [{
  label: '计划维度',
  value: 0
}, {
  label: '关键词维度',
  value: 1
}]

export const DEVICE_ALL = 0
export const DEVICE_PC = 1

export const allDevices = [{
//   label: '全部',
//   value: 0
// }, {
  label: 'PC',
  value: 1
}, {
  label: 'WAP',
  value: 2
}]

export const TIME_UNIT_YEAR = 4
export const TIME_UNIT_DAY = 1

export const allTimeUnits = [{
  label: '每日',
  value: 1
}, {
  label: '每周',
  value: 2
}, {
  label: '每月',
  value: 3
}, {
  label: '每年',
  value: 4
}]

export const columnOpts = [{
  label: '日期',
  value: 'date'
}, {
  label: '推广计划',
  value: 'campaignId'
}, {
  label: '渠道',
  value: 'channel' // 暂缺
}, {
  label: '设备',
  value: 'device'
}, {
  label: '关键词',
  value: 'keyword' // 暂缺
}, {
  label: '展现',
  value: 'shows'
}, {
  label: '点击',
  value: 'clicks'
}, {
  label: '平均点击单价',
  value: 'clickAvgPrice'
}, {
  label: '消费',
  value: 'cost'
}, {
  label: '点击率',
  value: 'clickRate'
}, {
  label: '平均排名',
  value: 'cpcRanking'
}]

export const fields = columnOpts.map(col => {
  return col.value.replace(/[A-Z]/g, (s) => {
    return '_' + s.toLowerCase()
  })
})
