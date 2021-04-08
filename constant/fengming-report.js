import dayjs from 'dayjs'

export const DIMENSION_CAMPAIGN = 0
export const DIMENSION_KEYWORD = 1
export const DIMENSION_NONE = 2 // 这是啥意思 ? @嘟嘟噜
export const DIMENSION_GROUP = 3
export const DIMENSION_SEARCH_KEYWORD = 99

export const CSV_REPORT_GENERATING = 0 // 生成中
export const CSV_REPORT_FINISHED = 2 // 完成
export const CSV_REPORT_EMPTY = 1 // 无数据

export const csvReportStatus = {
  0: '生成中',
  1: '无数据',
  2: '已生成'
}

export const allDimensions = [
  {
    label: '计划维度',
    value: DIMENSION_CAMPAIGN
  },
  {
    label: '单元维度',
    value: DIMENSION_GROUP
  },
  {
    label: '关键词维度',
    value: DIMENSION_KEYWORD
  },
  {
    label: '搜索词维度',
    value: DIMENSION_SEARCH_KEYWORD
  }
]

export const DEVICE_ALL = 0
export const DEVICE_WAP = 2
export const DEVICE_PC = 1

export const allDevices = [
  {
    label: '全部',
    value: 0
  },
  {
    label: '电脑端',
    value: 1
  },
  {
    label: '手机端',
    value: 2
  }
]

export const TIME_UNIT_YEAR = 4
export const TIME_UNIT_DAY = 1

export const allTimeUnits = [
  {
    label: '每日',
    value: 1
  },
  {
    label: '每周',
    value: 2
  },
  {
    label: '每月',
    value: 3
  },
  {
    label: '每年',
    value: 4
  }
]

export const timeTypes = [
  {
    label: '今日',
    value: 'today',
    getTime: () => ({
      startAt: dayjs().startOf('day').unix(),
      endAt: dayjs().unix()
    })
  },
  {
    label: '昨日',
    value: 'yesterday',
    getTime: () => ({
      startAt: dayjs().subtract('1', 'days').startOf('day').unix(),
      endAt: dayjs().subtract('1', 'days').endOf('day').unix()
    })
  },
  {
    label: '近7天',
    value: 'last-7-days',
    getTime: () => ({
      startAt: dayjs().subtract('7', 'days').unix(),
      endAt: dayjs().unix()
    })
  },
  {
    label: '本月',
    value: 'this-month',
    getTime: () => ({
      startAt: dayjs().startOf('month').unix(),
      endAt: dayjs().unix()
    })
  },
  {
    label: '上月',
    value: 'last-month',
    getTime: () => ({
      startAt: dayjs().subtract(1, 'month').startOf('month').unix(),
      endAt: dayjs().subtract(1, 'month').endOf('month').unix()
    })
  },
  {
    label: '自定义',
    value: 'custom'
  }
]

export const campaignColumnOpts = [
  {
    label: '日期',
    value: 'date'
  },
  {
    label: '推广计划',
    value: 'campaignId'
  },
  {
    label: '渠道',
    value: 'channel'
  },
  {
    label: '设备',
    value: 'device'
  },
  {
    label: '展现',
    value: 'shows'
  },
  {
    label: '点击',
    value: 'clicks'
  },
  {
    label: '平均点击单价',
    value: 'clickAvgPrice'
  },
  {
    label: '消费',
    value: 'cost'
  }
]

export const keywordColumnOpts = [
  {
    label: '日期',
    value: 'date'
  },
  {
    label: '推广计划',
    value: 'campaignId'
  },
  {
    label: '渠道',
    value: 'channel'
  },
  {
    label: '设备',
    value: 'device'
  },
  {
    label: '关键词id',
    value: 'keywordId'
  },
  {
    label: '关键词',
    value: 'keyword'
  },
  {
    label: '出价',
    value: 'price'
  },
  {
    label: '展现',
    value: 'shows'
  },
  {
    label: '点击',
    value: 'clicks'
  },
  {
    label: '平均点击单价',
    value: 'clickAvgPrice'
  },
  {
    label: '消费',
    value: 'cost'
  },
  {
    label: '点击率',
    value: 'clickRate'
  },
  {
    label: '平均排名',
    value: 'cpcRanking'
  }
]

function toUnderscore (s) {
  return s.replace(/[A-Z]/g, (s) => '_' + s.toLowerCase())
}

export const campaignFields = campaignColumnOpts.map((col) =>
  toUnderscore(col.value)
)
export const keywordFields = keywordColumnOpts.map((col) =>
  toUnderscore(col.value)
)

export const VISITOR_SOURCES = [
  {
    label: '未知',
    value: 0
  },
  {
    label: '百度',
    value: 1
  },
  {
    label: '搜狗',
    value: 2
  },
  {
    label: '神马',
    value: 3
  },
  {
    label: '360',
    value: 4
  }
]

export const VALID_VISITOR_STATUS = 0
export const INVALID_VISITOR_STATUS = 1

export function getVisitorLabel (val) {
  const tempObj = VISITOR_SOURCES.find((o) => o.value === Number(val))
  return tempObj ? tempObj.label : val
}
