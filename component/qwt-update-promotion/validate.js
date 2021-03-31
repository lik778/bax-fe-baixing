
import Schema from 'async-validator'
import { MIN_DAILY_BUDGET } from 'constant/fengming'
import { f2y } from 'util'

const descriptor = {
  areas: {
    message: '请选择投放区域',
    type: 'array',
    required: true,
    validator: (rule, value) => {
      return !!value.length
    }
  },
  dailyBudget (rule, value) {
    if (value * 100 < MIN_DAILY_BUDGET) {
      return new Error(`推广日预算需大于 ${f2y(MIN_DAILY_BUDGET)} 元`)
    }
    if (value > 10000000 * 100) {
      return new Error('推广日预算太高啦！您咋这么土豪呢~')
    }
    return true
  },
  validTime: {
    message: '请填写投放日期或选择长期投放',
    type: 'array',
    required: true,
    validator: (rule, value) => {
      return !!value.length
    }
  }
}

const validator = new Schema(descriptor)
export default validator
