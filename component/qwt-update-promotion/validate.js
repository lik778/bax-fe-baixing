
import Schema from 'async-validator'
import { MIN_DAILY_BUDGET, SEM_PLATFORM_QIHU, SEM_PLATFORM_SOGOU } from 'constant/fengming'
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
  },
  mobilePriceRatio: {
    message: '投放移动端的出价比率应在0.1 ～ 9.9之间',
    required: true,
    type: 'number',
    validator: (rule, value, cb, promotion) => {
      // TIP 搜狗/360只能在计划设置移动端出价比，不能在单元
      const { source } = promotion
      if (!(source === SEM_PLATFORM_QIHU || source === SEM_PLATFORM_SOGOU)) return true
      if (!value) return false
      const ratio = +(Number(value).toFixed(2))
      if (!(ratio >= 0.1 && ratio <= 9.9)) {
        return false
      }
      return true
    }
  }
}

const validator = new Schema(descriptor)
export default validator
