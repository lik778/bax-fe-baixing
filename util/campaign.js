
import { toTimestamp } from 'utils'

import {
  SEM_PLATFORM_QIHU,
  SEM_PLATFORM_SOGOU,
  SEM_PLATFORM_BAIDU,
  SEM_PLATFORM_SHENMA
} from 'constant/fengming'

export function fmtCpcRanking(ranking) {
  ranking = +ranking
  if (ranking < 1 && ranking > 5) {
    ranking = 5
  }
  return parseFloat(ranking).toFixed(1)
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

const validateRules = {
  [SEM_PLATFORM_SOGOU]: [{
    keys: ['title'],
    msg: '搜狗%s中关键词通配符不可连续出现，请修改',
    regExp: /\{[^}]+\}\{/
  }, {
    keys: ['content'],
    msg: '搜狗%s中最多可插入2个关键词通配符，请修改',
    validate(text) {
      const res = text.match(/\{[^}]+\}/g)
      if (res && res.length > 2) {
        return true
      }
    }
  }],
  [SEM_PLATFORM_BAIDU]: [{
    regExp: /\{投放地域\}/,
    msg: '百度%s不能存在地域通识别符，请修改'
  }],
  default: [{
    msg: '%s通配符内包含空格或符号，请修改',
    validate(text) {
      const regExp = /\{([^}]+)\}/g
      let res = regExp.exec(text)
      while (res) {
        if (/[^a-zA-Z0-9\u4e00-\u9fa5]/.test(res[1])) {
          return true
        }
        res = regExp.exec(text)
      }
    }
  }]
}
export function validateCreative({title = '', content = '', platforms = []}) {
  function validateCreative(validateRules) {
    for (const [key, rules] of Object.entries(validateRules)) {
      if (platforms.includes(+key) || key === 'default') {
        rules.forEach(({keys = ['title', 'content'], msg, validate, regExp}) => {
          const validator = regExp ? genValidator(regExp) : validate
          if (keys.includes('title') && validator(title)) {
            throw new Error(msg.replace('%s', '创意标题'))
          }
          if (keys.includes('content') && validator(content)) {
            throw new Error(msg.replace('%s', '创意内容'))
          }
        })
      }
    }
  }
  function genValidator(regExp) {
    return function(text) {
      if (regExp.test(text)) {
        return true
      }
    }
  }
  validateCreative(validateRules)
}
