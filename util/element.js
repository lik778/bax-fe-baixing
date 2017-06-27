
import {
  toTimestamp,
  toHumanTime,
  now
} from 'utils'

export function disabledDate(date) {
  const today = now('YYYY-MM-DD')
  const d = toHumanTime(date, 'YYYY-MM-DD')
  return toTimestamp(d) < toTimestamp(today)
}
