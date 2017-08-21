
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

export function renderColumnHeaderWithTip(tipText) {
  return (h, { column }) => {
    const tip = h('el-tooltip', {
      props: {
        effect: 'dark',
        content: tipText
      }
    }, [
      h('i', {
        class: 'el-icon-information',
        style: {
          marginLeft: '5px',
          fontSize: '12px',
          color: '#97a8be',
          cursor: 'help'
        }
      })
    ])
    return h('span', null, [
      column.label,
      tip
    ])
  }
}
