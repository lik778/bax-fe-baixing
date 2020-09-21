import {observable, action, toJS } from 'mobx'
import { COMMON_STATUS, ACTIVITY_STATUS, activityConfig, fengmingDiscountInfo } from 'constant/activity'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)

async function getServerTime() {
  const xhr = window.XMLHttpRequest ? new window.XMLHttpRequest()
    : new ActiveObject("Microsoft")
  xhr.open("GET","/main",false)
  xhr.send(null)
  const date = xhr.getResponseHeader("Date")
  return new Date(date)
}

const store = observable({
  _inActivityPeriod: null,
  _fengmingActivity: {
    discountInfoHTML: []
  },
  get inActivityPeriod() {
    return this._inActivityPeriod
  },
  get fengmingActivity() {
    return toJS(this._fengmingActivity)
  },
  setInActivityPeriod: action(async function() {
    const serverTime = await getServerTime()
    const { startTime, endTime } = activityConfig
    this._inActivityPeriod = dayjs(serverTime).isBetween(startTime, endTime)
  }),
  setFengmingActivity: action(async function() {
    await this.setInActivityPeriod()
    const type = this._inActivityPeriod ? ACTIVITY_STATUS : COMMON_STATUS
    this._fengmingActivity.discountInfoHTML = fengmingDiscountInfo[type]['discountInfoHTML']
  })
})

export default store
