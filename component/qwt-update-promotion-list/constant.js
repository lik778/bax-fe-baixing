
import {
  campaignOptimization
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
  const { kw_mark: kwMark, price_mark: priceMark, ctr_mark: ctrMark, default_mark: defaultMark } = row
  if (kwMark) {
    return '词'
  }
  if (priceMark) {
    return '价'
  }
  if (ctrMark) {
    return '创'
  }
  if (defaultMark) {
    return '设'
  }
  if (!kwMark && !priceMark && !ctrMark && !defaultMark) {
    return '-'
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
export {
  CAMPAIGN_OPTIMIZATION_OPTS,
  CAMPAIGN_STATUS_OPTS,
  options,
  OPTIMIZATION,
  filterOptimization
}
