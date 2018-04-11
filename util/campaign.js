
import { toTimestamp } from 'utils'

export function fmtCpcRanking(ranking) {
  if (ranking === 0 || ranking === -1) {
    return '无昨日排名'
  }

  return ranking
}

export function mergeKeywords(preWords, newWords) {
  const result = [...preWords.map(w => ({...w}))]

  newWords.forEach(w => {
    const words = result.map(w => w.word.toLowerCase())
    if (!words.includes(w.word.toLowerCase())) {
      result.push({...w})
    }
  })

  return result
}

export function getCampaignPrediction(total, prices) {
  const result = {
    dailyBudget: 100, // 元
    duration: 0 // 天
  }

  if (prices.filter(p => p > 3000).length) {
    result.dailyBudget = 300
  }
  // total, prices: 分
  result.duration = (total / result.dailyBudget / 100) | 0

  return result
}

const oneDay = 24 * 60 * 60 - 1 // sec

export function checkCampaignValidTime(range) {
  if (!range || range.length !== 2) {
    return 'invalid'
  }

  if (range[1] === null) {
    return 'long'
  }

  return 'custom'
}

export function getCampaignValidTime(range) {
  if (range[0] === null || range[1] === null) {
    return [null, null] // 长期
  }

  return [
    toTimestamp(range[0]),
    toTimestamp(range[1]) + oneDay
  ]
}
