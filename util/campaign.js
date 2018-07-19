
import { toTimestamp } from 'utils'

import {
  SEM_PLATFORM_SHENMA
} from 'constant/fengming'

export function fmtCpcRanking(ranking) {
  if (ranking === 0 || ranking === -1) {
    return '无昨日排名'
  }

  return ranking
}

export function mergeKeywords(preWords, newWords) {
  const result = preWords

  newWords.forEach(w => {
    const words = result.map(w => w.word.toLowerCase())
    if (!words.includes(w.word.toLowerCase())) {
      result.push(w)
    }
  })

  return result
}

/*
  availableBalance: 此刻账户余额扣除今日所有在线计划剩余预算后的余额
*/
export function getCampaignPrediction(availableBalance, dailyBudget, prices) {
  const prediction = {
    minDailyBudget: 10000,
    days: 0
  }

  if (prices.some(p => p > 3000)) {
    prediction.minDailyBudget = 30000
  }
  prediction.days = (availableBalance / dailyBudget) | 0

  return prediction
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

export function getCreativeTitleLenLimit(platforms) {
  let min = 9
  let max = 25
  if (platforms.includes(SEM_PLATFORM_SHENMA)) {
    // [8, 35]
    min = 8
  }

  return [min, max]
}

export function getCreativeContentLenLimit(platforms) {
  let min = 9
  let max = 40
  if (platforms.includes(SEM_PLATFORM_SHENMA)) {
    // [8, 68]
    min = 8
  }

  return [min, max]
}
