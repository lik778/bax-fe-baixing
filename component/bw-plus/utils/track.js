import track from 'util/track'
import qs from 'query-string'
let startTime = 0
let inputStartTime = 0
export const bwPlusTrack = (action, opt) => {
  const { user_id: userId, sales_id: salesId } = qs.parse(location.search)
  track({
    site_id: 'bw-plus',
    action,
    ...opt,
    userId,
    salesId
  })
}

export const time = (type) => {
  if (type === 'create') {
    return Date.now() / 1000 - startTime
  } else {
    return Date.now() / 1000 - inputStartTime
  }
}

export const getStart = () => {
  if (!inputStartTime) {
    inputStartTime = Date.now() / 1000
  }
  if (!startTime) {
    startTime = Date.now() / 1000
  }
}
