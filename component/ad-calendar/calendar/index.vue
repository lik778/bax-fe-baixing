
<template>
  <content class="calendar">
    <div v-if="!hasData">
      ~ 您的筛选条件下无冲突订单哟 ~
    </div>
    <header v-if="hasData">
      <span>
        <label>区域</label>
        <label>类目</label>
      </span>
      <days-tip :days="days" />
    </header>
    <main v-if="hasData">
      <div v-for="row in rows">
        <span>
          <label :title="formatArea(row.area)">
            {{ formatArea(row.area) }}
          </label>
          <label :title="formatCategory(row.category)">
            {{ formatCategory(row.category) }}
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

import {
  getCnName
} from 'util/meta'

export default {
  name: 'ad-calendar-main',
  props: {
    allCategories: {
      type: Array,
      required: true
    },
    allAreas: {
      type: Array,
      required: true
    },
    options: {
      type: Object,
      required: true
    },
    orders: {
      type: Array,
      required: true
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
    formatCategory(v) {
      const { allCategories } = this
      return getCnName(v, allCategories)
    },
    formatArea(v) {
      const { allAreas } = this
      return getCnName(v, allAreas)
    },
    getDays() {
      const { options } = this
      const seconds = (options.end - options.start) || 0
      const num = ((seconds / 60 / 60 / 24) + 1) | 0
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
  computed: {
    hasData() {
      return !!this.rows.length
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

  & > div {
    @mixin center;
    margin: 10px 0;
    font-size: 18px;
    color: gray;
  }

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
