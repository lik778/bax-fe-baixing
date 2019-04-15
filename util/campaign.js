
import { toTimestamp } from 'utils'

import {
  SEM_PLATFORM_QIHU,
  SEM_PLATFORM_SOGOU,
  SEM_PLATFORM_BAIDU,
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
  if (platforms.length === 1 && platforms.includes(SEM_PLATFORM_SHENMA)) {
    // [8, 35], 较为宽松
    min = 8
    max = 35
  }

  return [min, max]
}

export function getCreativeContentLenLimit(platforms) {
  let min = 9
  let max = 40
  if (platforms.includes(SEM_PLATFORM_SHENMA) && !platforms.includes(SEM_PLATFORM_QIHU) && !platforms.includes(SEM_PLATFORM_SOGOU)) {
    // [8, 68], 较为宽松
    min = 8
    max = 68
  }
  if (platforms.length === 1 && platforms.includes(SEM_PLATFORM_BAIDU)) {
    max = 80
  }

  return [min, max]
}

export function validateCreative({title = '', content = ''}) {
  function validate(text, prefix = '') {
    const regExp = /\{([^}]+)\}/g
    let res = regExp.exec(text)
    while (res) {
      if (/[^a-zA-Z0-9]/.test(res[1])) {
        throw new Error(prefix + '通配符内包含空格或符号，请修改')
      }
      res = regExp.exec(text)
    }
  }
  validate(title, '创意标题')
  validate(content, '创意内容')
}
