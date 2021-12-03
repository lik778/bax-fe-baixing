// 记录推广总时间
const trackTimes = function () {
  let firstTime = 0
  let allTime = 0
  return function (item) {
    const current = new Date().getTime()
    if (item === 2) {
      allTime = current - firstTime
      return allTime
    } else {
      firstTime = current
    }
  }
}
export const TimeTracker = trackTimes()

// 记录输入的时间
const inputTimes = function () {
  let i = 0
  let c = 0
  return function (item = 'foucs') {
    i = i + 1
    if (i === 1) {
      c = new Date().getTime()
    }
    if (item === 'blur') {
      return new Date().getTime() - c
    }
  }
}
export const TimeInput = inputTimes()

// 记录选取推广关键词的时间
const keywordTimes = function () {
  let i = 0
  let c = 0
  return function (item = 'start') {
    i = i + 1
    if (i === 1) {
      c = new Date().getTime()
    }
    if (item === 'keyword') {
      return new Date().getTime() - c
    }
  }
}
export const wordTime = keywordTimes()
