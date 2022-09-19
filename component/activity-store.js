
import { observable, action, toJS } from 'mobx'
import {
  COMMON_STATUS, ACTIVITY_STATUS, activityConfig,
  fengmingDiscountInfo, biaowangDiscountInfo, carefreeDiscountInfo
} from 'constant/activity'
import { MERCHANTS } from 'constant/product'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)

const { FENG_MING_MERCHANT_CODE, PHOENIXS_MERCHANT_CODE, CARE_FREE_MERCHANT_CODE } = MERCHANTS

async function getServerTime () {
  const xhr = window.XMLHttpRequest
    ? new window.XMLHttpRequest()
    : new window.ActiveObject('Microsoft')
  xhr.open('GET', '/main', false)
  xhr.send(null)
  const date = xhr.getResponseHeader('Date')
  return new Date(date)
}

const store = observable({
  _inActivityPeriod: null,
  _discountInfoHTML: [],
  get inActivityPeriod () { // 1
    return this._inActivityPeriod
  },
  get discountInfoHTML () {
    return toJS(this._discountInfoHTML)
  },
  setInActivityPeriod: action(async function () {
    const serverTime = await getServerTime()
    const { startTime, endTime } = activityConfig
    this._inActivityPeriod = dayjs(serverTime).isBetween(startTime, endTime)
  }),
  setDiscountInfoHTMLFactory: action(async function (productTabMchCode = FENG_MING_MERCHANT_CODE) {
    // todo: 这里多次获取服务器时间要优化
    await this.setInActivityPeriod()
    const type = this._inActivityPeriod ? ACTIVITY_STATUS : COMMON_STATUS
    let discountInfo = null
    if (productTabMchCode === FENG_MING_MERCHANT_CODE) {
      discountInfo = fengmingDiscountInfo
    } else if (productTabMchCode === PHOENIXS_MERCHANT_CODE) {
      discountInfo = biaowangDiscountInfo
    } else if (productTabMchCode === CARE_FREE_MERCHANT_CODE) {
      discountInfo = carefreeDiscountInfo
    }
    this._discountInfoHTML = discountInfo[type].discountInfoHTML
  })
})

export default store
