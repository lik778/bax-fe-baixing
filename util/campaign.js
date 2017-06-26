
import { toTimestamp } from 'utils'

export function getCampaignPrediction(total, prices) {
  const result = {
    dailyBudget: 100, // 元
    duration: 0 // 天
  }

  if (prices.filter(p => p > 3000).length) {
    result.dailyBudget = 300
  }

  result.duration = total / result.dailyBudget | 0

  return result
}

const oneDay = 24 * 60 * 60 - 1 // sec

export function getCampaignValidTime(range) {
  return [
    toTimestamp(range[0]),
    toTimestamp(range[1]) + oneDay
  ]
}
