
import Schema from 'async-validator'
import { LANDING_TYPE_AD, LANDING_TYPE_GW, LANDING_TYPE_STORE, LANDING_TYPE_BAIDU_JIMUYU, MATCH_TYPE_EXACT, NEGATIVE_KEYWORDS_MAX, getMatchTypeObj, SEM_PLATFORM_BAIDU, SEM_PLATFORM_SOGOU, NEGATIVE_KEYWORDS_SOGOU_MAX } from 'constant/fengming'
import { MIN_WORD_PRICE, MAX_WORD_PRICE } from 'constant/keyword'
import { keywordPriceTip } from 'constant/tip'
const LANDING_TYPE_ENUMS = [LANDING_TYPE_AD, LANDING_TYPE_GW, LANDING_TYPE_STORE, LANDING_TYPE_BAIDU_JIMUYU]
const GROUP_NAME_MAX = 6
const GROUP_NAME_MIN = 1
const KEYWORDS_MIN = JSON.parse(window.localStorage.getItem('isSpecial')) === 0 ? 20 : 1

const commonDescriptor = {
  name: {
    message: '单元名称字数限制1～6个',
    type: 'string',
    required: true,
    validator: (rule, value) => {
      return (value.length >= GROUP_NAME_MIN && value.length <= GROUP_NAME_MAX)
    }
  },
  landingType: {
    message: 'hi, 投放类型不能为空',
    type: 'number',
    required: true,
    validator: (rule, value) => {
      return LANDING_TYPE_ENUMS.includes(value)
    }
  },
  landingPage: {
    message: 'hi，投放落地页不能为空哦！',
    type: 'string',
    required: true,
    validator: (rule, value) => {
      return !!value
    }
  },
  landingPageId: {
    message: 'hi, 投放落地页的pageId不能为空哦！',
    type: 'number',
    required: false,
    validator: (rule, value, cb, source) => {
      if ([LANDING_TYPE_AD, LANDING_TYPE_STORE].includes(source.landingType)) {
        return !!value
      }
      return true
    }
  },
  mobilePriceRatio: {
    message: '投放移动端的出价比率应在0.1 ～ 9.9之间',
    required: true,
    type: 'number',
    validator: (rule, value, cb, source) => {
      // TIP 百度渠道支持单元移动端出价比，搜狗/360在计划纬度，神马单元和计划都无此字段
      if (source.promotion.source !== SEM_PLATFORM_BAIDU) return true
      if (!value) return false
      const ratio = +(Number(value).toFixed(2))
      if (!(ratio >= 0.1 && ratio <= 9.9)) {
        return false
      }
      return true
    }
  },
  creatives (rule, value) {
    if (!value.length) return new Error('还未添加创意信息')
    if (value.some(o => o.title === '')) return new Error('请填写推广标题')
    if (value.some(o => o.content === '')) return new Error('请填写推广内容')
    if (value.some(o => !o.lenValid)) return new Error('创意内容不符合要求')
    const errVal = value.find(o => !!o.msg)
    if (errVal) return new Error(errVal.msg)
    return true
  },
  negativeWords (rule, value, cb, source) {
    const negativeWordsMax = source.promotion.source === SEM_PLATFORM_SOGOU ? NEGATIVE_KEYWORDS_SOGOU_MAX : NEGATIVE_KEYWORDS_MAX
    if (value.length > negativeWordsMax) return new Error(`否词个数不得超过${negativeWordsMax}个`)
    return true
  }
}

const createDescriptor = {
  ...commonDescriptor,
  keywords (rule, value) {
    if (value.length < KEYWORDS_MIN) return new Error('请至少添加20个关键词')
    if (value.some(o => o.price < MIN_WORD_PRICE || o.price > MAX_WORD_PRICE)) return new Error(keywordPriceTip)
    return true
  },
  price (rule, value) {
    if (!value) return new Error('还未填写关键词出价哦！')
    if (value > MAX_WORD_PRICE || value < MIN_WORD_PRICE) return new Error('关键词价格需在[2, 999]区间内')
    return true
  }
}

const updateDescriptor = {
  ...commonDescriptor,
  keywords (rule, value) {
    const wordLen = value.filter(o => !o.isDel).length
    if (wordLen < KEYWORDS_MIN) return new Error('请至少添加20个关键词')
    const maxMatchTypeExactCount = getMatchTypeObj(wordLen).count(wordLen)
    const currMatchTypeExactCount = value.filter(o => o.matchType === MATCH_TYPE_EXACT).length
    if (currMatchTypeExactCount > maxMatchTypeExactCount) return new Error('精确匹配的设置已超过系统限制，请修改')
    if (value.some(o => o.price < MIN_WORD_PRICE || o.price > MAX_WORD_PRICE)) return new Error(keywordPriceTip)
    return true
  }
}

export const createValidator = new Schema(createDescriptor)
export const updateValidator = new Schema(updateDescriptor)
