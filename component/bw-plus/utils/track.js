import track from 'util/track'
import qs from 'query-string'

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
