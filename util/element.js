
import {
  toTimestamp,
  toHumanTime,
  now
} from 'utils'

export function disabledDate (date) {
  const today = now('YYYY-MM-DD')
  const d = toHumanTime(date, 'YYYY-MM-DD')
  return toTimestamp(d) < toTimestamp(today)
}

export function renderColumnHeaderWithTip (tipText) {
  return (h, { column, labelClass, wrapClass, labelStyle }) => {
    const tip = h('el-tooltip', {
      props: {
        effect: 'dark',
        content: tipText,
        placement: 'top'
      }
    }, [
      h('i', {
        class: 'el-icon-question',
        style: {
          marginLeft: '5px',
          fontSize: '12px',
          color: '#97a8be',
          cursor: 'help'
        }
      })
    ])
    const wrapStyle = {
      display: 'flex',
      alignItems: 'center'
    }
    return h('div', { class: wrapClass, style: wrapStyle }, [
      h('div', { class: labelClass, style: labelStyle, domProps: { innerHTML: column.label } }),
      tip
    ])
  }
}
