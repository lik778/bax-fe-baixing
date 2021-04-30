
import {
  campaignOptimization,
  CAMPAIGN_STATUSES,
  GROUP_STATUSES
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
const CAMPAIGN_STATUS_OPTS = Object.freeze(Object.keys(CAMPAIGN_STATUSES))
const GROUP_STATUSES_OPTS = Object.freeze(Object.keys(GROUP_STATUSES))
export {
  CAMPAIGN_OPTIMIZATION_OPTS,
  CAMPAIGN_STATUS_OPTS,
  GROUP_STATUSES_OPTS,
  OPTIMIZATION,
  CAMPAIGN_STATUSES,
  GROUP_STATUSES,
  filterOptimization
}
