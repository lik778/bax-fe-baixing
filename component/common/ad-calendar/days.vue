
<template>
  <section>
    <p v-for="(item, i) in items" :key="i"
      v-bind:class="{ checked: item.checked }">
    </p>
  </section>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ad-calendar-days',
  props: {
    ranges: {
      type: Array,
      required: true
    },
    days: {
      type: Array,
      required: true
    },
    area: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    }
  },
  computed: {
    items() {
      return this.days.map(day => ({
        checked: hitRanges(day, this.ranges)
      }))
    }
  }
}

function hitRanges(day, ranges) {
  const m = moment(day, 'YYYY-MM-DD')
  const start = m.startOf('day').unix()
  const end = m.endOf('day').unix()

  let yes = false
  for (const r of ranges) {
    if (start >= r[0] && end <= r[1]) {
      yes = true
    }
  }

  return yes
}
</script>

<style scoped>

section {
  display: flex;
  align-items: center;

  & > p {
    width: 28px;
    height: 28px;
    border-top: 1px solid #a3b2c4;
    border-left: 1px solid #a3b2c4;
    border-bottom: 1px solid #a3b2c4;

    &.checked {
      background: #20a0ff;
    }

    &:last-child {
      border-right: 1px solid #a3b2c4;
    }
  }
}

</style>
