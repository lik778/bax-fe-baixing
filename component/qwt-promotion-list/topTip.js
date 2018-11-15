import Vue from 'vue'
import { renderColumnHeaderWithTip } from 'util'

export default Vue.component('top-tip', {
  functional: true,
  render(h, context) {
    const { tip, label } = context.props
    return renderColumnHeaderWithTip(tip)(h, {column: {label}})
  }
})
