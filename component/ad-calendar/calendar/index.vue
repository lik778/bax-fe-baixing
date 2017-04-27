
<template>
  <content class="calendar">
    <header>
      <span>
        <label>区域</label>
        <label>类目</label>
      </span>
      <days-tip :days="days" />
    </header>
    <main>
      <div v-for="row in rows">
        <span>
          <label :title="row.area">
            {{ row.area }}
          </label>
          <label :title="row.category">
            {{ row.category }}
          </label>
        </span>
        <span>
          <days :category="row.category" :area="row.area"
            :ranges="row.ranges" :days="days" />
        </span>
      </div>
    </main>
  </content>
</template>

<script>

import DaysTip from './days-tip'
import Days from './days'

import moment from 'moment'

export default {
  name: 'ad-calendar-main',
  props: {
    options: {
      type: Object,
      requireed: true
    },
    orders: {
      type: Array,
      requireed: true
    }
  },
  components: {
    DaysTip,
    Days
  },
  data() {
    return {
      rows: [],
      days: []
    }
  },
  methods: {
    getDays() {
      const { options } = this
      const seconds = (options.end - options.start) || 0
      const num = moment.duration(seconds, 'seconds').days()
      const start = moment(options.start * 1000).format('YYYY-MM-DD')

      const days = []
      for (let i = 0; i <= num; i++) {
        const d = moment(start, 'YYYY-MM-DD').add(i, 'day')
        days.push(d.format('YYYY-MM-DD'))
      }

      this.days = days
    },
    getRows() {
      const { orders } = this

      const rowInfo = {}

      for (const o of orders) {
        for (const a of o.areas) {
          for (const c of o.categories) {
            const k = a + '-' + c
            if (rowInfo[k]) {
              rowInfo[k].push(o.timeRange)
            } else {
              rowInfo[k] = [o.timeRange]
            }
          }
        }
      }

      this.rows = Object.keys(rowInfo).map((k) => ({
        category: k.split('-')[1],
        area: k.split('-')[0],
        ranges: rowInfo[k]
      }))
    }
  },
  watch: {
    'options.start': function() {
      this.getDays()
    },
    'options.end': function() {
      this.getDays()
    },
    'orders': function() {
      this.getRows()
    }
  }
}

</script>

<style scoped>

@import 'cssbase/mixin';

.calendar {
  padding: 30px;

  & > header {
    display: flex;
    align-items: center;

    & > span {
      display: flex;
      align-items: center;

      & > label {
        min-width: 100px;
      }
    }
  }

  & > main {
    & > div {
      display: flex;
      align-items: center;
      margin: 5px 0;

      & > span {
        display: flex;
        align-items: center;

        & > label {
          @mixin wordline;
          min-width: 100px;
          max-width: 100px;
        }
      }
    }
  }
}

</style>
