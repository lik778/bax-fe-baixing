
export const allDimensions = [{
  label: '计划维度',
  value: 0
}, {
  label: '关键词维度',
  value: 1
}, {
  label: '全部',
  value: 2
}]

export const allDevices = [{
  label: '全部',
  value: 0
}, {
  label: 'PC',
  value: 1
}, {
  label: 'WAP',
  value: 2
}]

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
  label: '点击均价',
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
