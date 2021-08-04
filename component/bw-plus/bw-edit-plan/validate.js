
import Schema from 'async-validator'
import { LANDING_TYPE_AD, LANDING_TYPE_STORE } from 'constant/fengming'

const LANDING_TYPE_ENUMS = [LANDING_TYPE_AD, LANDING_TYPE_STORE]

// const checkCreative = (title, content) => {
//   if (!title || !content) {
//     return '标题和内容不能为空'
//   } else if (this.titleMinLen > title.length || this.titleMaxLen < title.length) {
//     return '标题字数限制为9-25个字'
//   } else if (this.contentMinLen > content.length || this.contentMaxLen < content.length) {
//     return '内容字数限制9-80个字'
//   }
// }

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
  },
  creativeTitle: {
    message: 'hi，标题字数限制为9-25个字！',
    type: 'string',
    require: true,
    min: 9,
    max: 25
  },
  creativeContent: {
    message: 'hi，内容字数限制9-80个字！',
    type: 'string',
    require: true,
    min: 9,
    max: 80
  }
}

export const createValidator = new Schema(createDescriptor)
