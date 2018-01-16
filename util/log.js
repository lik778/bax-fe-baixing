
import { formatCategoriesOrAreas } from './meta'

import {
  toHumanTime,
  centToYuan
} from 'utils'

import {
  CAMPAIGN_STATUS_OFFLINE,
  CAMPAIGN_STATUS_ONLINE,
  semPlatformCn,
  landingType
} from 'constant/fengming'

import {
  LOG_TYPE_CAMPAIGN,
  LOG_TYPE_CREATIVE,
  LOG_TYPE_KEYWORD,
  LOG_TYPE_ACCOUNT
} from 'constant/log'

const OP_CREATE = 1
const OP_UPDATE = 2

/**
 * @return {String}
 */

export function getLogDesc(log, { allAreas = [] }) {
  const {
    timelineType,
    message
  } = log

  if (message) {
    const { change, opType, word, campaignId } = message

    switch (timelineType) {
      case LOG_TYPE_CAMPAIGN:
        return fmtCampaignLog(opType, {
          ...change,
          campaignId
        }, allAreas)
      case LOG_TYPE_CREATIVE:
        return fmtCreativeLog(opType, change)
      case LOG_TYPE_KEYWORD:
        return fmtKeywordLog(opType, {
          word,
          ...change
        })
      case LOG_TYPE_ACCOUNT:
        return fmtAccountLog({
          campaignId,
          ...change
        })
    }
  }

  return ''
}

/**
 * private
 */

function fmtAccountLog(change) {
  if (!change) {
    return ''
  }

  const money = (change.deltaMoney + change.deltaPoint) / 100
  const date = toHumanTime(change.reportDate, 'MM月DD日 HH:mm')
  if (money > 0) {
    return `充值：${money}元，推广ID：${change.campaignId}，充值时间：${date}`
  } else {
    return `消费：${Math.abs(money)}元，推广ID：${change.campaignId}，消费时间：${date}`
  }
}

function fmtCampaignLog(type, change = {}, allAreas) {
  let result = ''

  const ops = []
  if (type === OP_CREATE) {
    result += `新建推广：ID - ${change.campaignId}；`
  } else {
    result += `更新推广：ID - ${change.campaignId}；`
  }

  if (change.status) {
    const status = change.status.newValue
    if ([CAMPAIGN_STATUS_OFFLINE, CAMPAIGN_STATUS_ONLINE].includes(status)) {
      result = status === CAMPAIGN_STATUS_OFFLINE ? '计划下线' : '计划上线'
      result += `：ID - ${change.campaignId}`
      try {
        const reason = change.extra.newValue.campaignDeletedReason
        if (reason) {
          result += `；原因 - ${reason}。`
        }
      } catch (err) {
        // ignore
      }
      return result
    }
  }

  Object.keys(change).map(key => {
    const val = change[key]

    if (type === OP_CREATE) {
      switch (key) {
        case 'areas':
          ops.push('投放区域 - ' + formatCategoriesOrAreas(val, allAreas))
          break
        case 'timeRange':
          ops.push('投放时间 - ' + getTimeRangeDesc(val))
          break
        case 'dailyBudget':
          ops.push('每日预算 - ' + centToYuan(val) + '元')
          break
        case 'floatPercent':
          break
        case 'landingPage':
          ops.push('投放页地址 - ' + val)
          break
        case 'landingType':
          ops.push('投放页面 - ' + landingType[String(val)])
          break
        case 'mobilePriceRatio':
          ops.push('移动端出价比例 - ' + val)
          break
        case 'source':
          ops.push('推广渠道 - ' + semPlatformCn[String(val)])
          break
      }
    } else {
      switch (key) {
        case 'areas':
          const o = formatCategoriesOrAreas(val.oldValue, allAreas)
          const n = formatCategoriesOrAreas(val.newValue, allAreas)
          ops.push(`投放区域 - 从 ${o}『变更为』${n}`)
          break
        case 'timeRange':
          ops.push(`投放时间 - 从 ${getTimeRangeDesc(val.oldValue)}『变更为』${getTimeRangeDesc(val.newValue)}`)
          break
        case 'dailyBudget':
          ops.push(`每日预算 - 从 ${centToYuan(val.oldValue)}元『变更为』${centToYuan(val.newValue)}元`)
          break
        case 'floatPercent':
          break
        case 'landingPage':
          ops.push(`投放页地址 - 从 ${val.oldValue}『变更为』${val.newValue}`)
          break
        case 'landingType':
          ops.push(`投放页面 - 从 ${landingType[String(val.oldValue)]}『变更为』${landingType[String(val.newValue)]}`)
          break
        case 'mobilePriceRatio':
          ops.push(`移动端出价比例 - 从 ${val.oldValue}『变更为』${val.newValue}`)
          break
        case 'source':
          ops.push(`推广渠道 - 从 ${semPlatformCn[String(val.oldValue)]}『变更为』${semPlatformCn[String(val.newValue)]}`)
          break
      }
    }
  })

  result += ops.join('；') + '。'

  return result
}

function fmtCreativeLog(type, change = {}) {
  let result = ''

  const {
    content,
    title
  } = change

  const ops = []

  if (type === OP_CREATE) {
    result += '新建创意：'
    if (title) {
      ops.push('【标题】' + title)
    }
    if (content) {
      ops.push('【内容】' + content)
    }
  } else {
    result += '更新创意：'
    if (title) {
      ops.push(`【标题】从『${title.oldValue}』变更为『${title.newValue}』`)
    }
    if (content) {
      ops.push(`【内容】从『${content.oldValue}』变更为『${content.newValue}』`)
    }
  }

  result += ops.join('；') + '。'

  return result
}

function fmtKeywordLog(type, change) {
  let result = ''

  const {
    price,
    word
  } = change

  if (type === OP_CREATE) {
    result += '添加关键词：'
    result += `【${word}】，价格：${centToYuan(price)}元。`
  } else {
    result += '更新关键词：'
    try {
      const { oldValue, newValue } = price
      result += `【${word}】，价格从${centToYuan(oldValue)}元『变更为』${centToYuan(newValue)}元。`
    } catch (err) {
      console.error(err)
    }
  }

  return result
}

function getTimeRangeDesc(range) {
  if (!range || (range[0] === null)) {
    return '长期'
  }

  return toHumanTime(range[0], 'YYYY-MM-DD') + '至' +
    toHumanTime(range[0], 'YYYY-MM-DD')
}
