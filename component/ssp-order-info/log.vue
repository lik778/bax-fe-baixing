
<template>
  <div>
    <span>{{ info.createdAt | toHumanTime }}</span>
    <label>从:</label>
    <span>{{ info.fromValue | orderStatus }}</span>
    <label>变更为:</label>
    <span>{{ info.toValue | orderStatus }}</span>
  </div>
</template>

<script>
import { toHumanTime } from 'utils'

import {
  sspOrderStatus
} from 'constant/order'

export default {
  name: 'log',
  props: {
    info: {
      type: Object,
      required: true
    }
  },
  filters: {
    orderStatus(s) {
      return sspOrderStatus[String(s)]
    },
    toHumanTime
  }
}
</script>
