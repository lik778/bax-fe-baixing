
import { toTimestamp } from 'utils'

export function fmtCpcRanking(ranking) {
  if (ranking === 0) {
    return '未知'
  }

  return ranking
}

export function mergeKeywords(preWords, newWords) {
  const words = preWords.map(w => w.word)

  return [
    ...newWords.filter(w => !words.includes(w.word)).map(w => ({...w})),
    ...preWords.map(w => ({...w}))
  ]
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
