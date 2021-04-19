
import {
  campaignOptimization,
  semPlatformCn
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
  if (row.kw_mark) {
    return '词'
  }
  if (row.price_mark) {
    return '价'
  }
  if (row.ctr_mark) {
    return '创'
  }
  if (row.default_mark) {
    return '设'
  }
}
const CAMPAIGN_STATUS_OPTS = Object.freeze(
  [
    { label: '推广中/审核中', value: '100' },
    { label: '计划预算不足', value: '5' },
    { label: '账户余额不足', value: '-51' },
    { label: '已暂停', value: '-10,-50' },
    { label: '已下线', value: '-1' },
    { label: '审核驳回', value: '-53' }
  ]
)
const options = [{
  value: 1,
  label: '计划1'
}, {
  value: 2,
  label: '计划2'
}, {
  value: 3,
  label: '计划3'
}, {
  value: 4,
  label: '计划4'
}, {
  value: 5,
  label: '计划5'
}]

const columns = [
  {
    id: 0,
    prop: 'id',
    lable: '计划id',
    template: false
  },
  {
    id: 1,
    prop: 'opt',
    lable: '优化项',
    formatter: row => filterOptimization(row),
    template: false
  },
  {
    id: 2,
    prop: 'status_text',
    lable: '状态',
    template: false
  },
  {
    id: 3,
    prop: 'source',
    lable: '渠道',
    template: false,
    formatter: (row, column, cellValue) => semPlatformCn[cellValue]
  }
]
const unitData = [
  {
    id: 0,
    name: '单元1',
    promotion: '计划1',
    source: [],
    status: 0,
    youhua: '词',
    word: 0.00
  }
]
const unitColums = [
  {
    prop: 'name',
    label: '单元名称'
  },
  {
    prop: 'promotion',
    label: '所属计划'
  },
  {
    prop: 'source',
    label: '渠道'
  },
  {
    prop: 'status',
    label: '投放状态'
  },
  {
    prop: '',
    label: '投放优化',
    formatter: row => filterOptimization(row)
  },
  {
    prop: 'word',
    label: '关键词平均排名'
  }
]
export {
  CAMPAIGN_OPTIMIZATION_OPTS,
  CAMPAIGN_STATUS_OPTS,
  options,
  OPTIMIZATION,
  columns,
  unitData,
  unitColums,
  filterOptimization
}
