
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
