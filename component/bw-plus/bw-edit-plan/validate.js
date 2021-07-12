
import Schema from 'async-validator'
import { LANDING_TYPE_AD, LANDING_TYPE_STORE } from 'constant/fengming'

const LANDING_TYPE_ENUMS = [LANDING_TYPE_AD, LANDING_TYPE_STORE]

const createDescriptor = {
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
  }
}

export const createValidator = new Schema(createDescriptor)
