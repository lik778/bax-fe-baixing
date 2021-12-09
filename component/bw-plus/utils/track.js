import track from 'util/track'
import qs from 'query-string'

export const bwPlusTrack = (action, opt) => {
  const { user_id: userId, sales_id: salesId } = qs.parse(location.search)
  const createTime = new Date().getTime()
  track({
    site_id: 'bw-plus',
    action,
    ...opt,
    createTime,
    userId,
    salesId
  })
}
