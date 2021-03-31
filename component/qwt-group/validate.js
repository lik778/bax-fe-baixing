
import Schema from 'async-validator'
import { LANDING_TYPE_AD, LANDING_TYPE_GW, LANDING_TYPE_STORE, MATCH_TYPE_EXACT, NEGATIVE_KEYWORDS_MAX } from 'constant/fengming'
import { MIN_WORD_PRICE, MAX_WORD_PRICE } from 'constant/keyword'
import { keywordPriceTip } from 'constant/tip'

const LANDING_TYPE_ENUMS = [LANDING_TYPE_AD, LANDING_TYPE_GW, LANDING_TYPE_STORE]
const GROUP_NAME_MAX = 6
const GROUP_NAME_MIN = 1
const KEYWORDS_MIN = 20

const descriptor = {
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
  name: {
    message: '单元名称字数限制1～6个',
    type: 'string',
    required: true,
    validator: (rule, value) => {
      return (value.length >= GROUP_NAME_MIN && value.length <= GROUP_NAME_MAX)
    }
  },
  mobilePriceRatio: {
    message: '投放移动端的出价比率应在0.1 ～ 9.9之间',
    required: true,
    type: 'number',
    validator: (rule, value) => {
      if (!value) return false
      const ratio = +(Number(value).toFixed(2))
      if (!ratio >= 0.1 && ratio <= 9.9) {
        return false
      }
      return true
    }
  },
  creatives (rule, value) {
    if (!value.length) return new Error('还为添加创意信息')
    if (value.some(o => o.title === '')) return new Error('请填写推广标题')
    if (value.some(o => o.content === '')) return new Error('请填写推广内容')
    return true
  },
  keywords (rule, value) {
    if (value.length < KEYWORDS_MIN) return new Error('请至少添加20个关键词')
    // TODO: 动态获取精确匹配的最大值
    const maxMatchTypeExactCount = 20
    const currMatchTypeExactCount = value.filter(o => o.matchType === MATCH_TYPE_EXACT).length
    if (currMatchTypeExactCount > maxMatchTypeExactCount) return new Error('精确匹配的设置已超过系统限制，请修改')
    if (value.some(o => o.price < MIN_WORD_PRICE || o.price > MAX_WORD_PRICE)) return new Error(keywordPriceTip)
    return true
  },
  negativeWords (rule, value) {
    if (value.length > NEGATIVE_KEYWORDS_MAX) return new Error(`否词个数不得超过${NEGATIVE_KEYWORDS_MAX}个`)
    return true
  }
}

const validator = new Schema(descriptor)
export default validator
