
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
      <days-tip :days="days"></days-tip>
    </header>
    <main v-if="hasData">
      <div v-for="(row, i) in rows" :key="i">
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
            :ranges="row.ranges" :days="days">
          </days>
        </span>
      </div>
    </main>
  </content>
</template>

<script>
import DaysTip from './days-tip'
import Days from './days'

import dayjs from 'dayjs'

import {
  getCategoryParent,
  getAreaParent,
  getCnName
} from 'util/meta'

const isArray = Array.isArray

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
  data () {
    return {
    }
  },
  computed: {
    validCategories () {
      const {
        allCategories,
        options
      } = this

      if (!isArray(options.categories)) {
        return []
      }

      if (options.categories.includes('all-categories')) {
        return allCategories.map(i => i.name)
      }

      return options.categories.reduce((pre, now) => {
        const items = allCategories.filter(i => {
          return i.name === now ||
            i.belongsToFirst === now ||
            i.belongsToSecond === now ||
            getCategoryParent(allCategories, now) === i.name
        }).map(i => i.name)

        return [...pre, ...items]
      }, [])
    },
    validAreas () {
      const {
        allAreas,
        options
      } = this

      if (!isArray(options.areas)) {
        return []
      }

      if (options.areas.includes('quanguo')) {
        return allAreas.map(i => i.name)
      }

      return options.areas.reduce((pre, now) => {
        const items = allAreas.filter(i => {
          return i.name === now || i.parent === now ||
            getAreaParent(allAreas, now) === i.name
        }).map(i => i.name)

        return [...pre, ...items]
      }, [])
    },
    rows () {
      const {
        allCategories,
        allAreas,
        orders
      } = this

      const rowInfo = {}

      for (const o of orders) {
        // NOTE: categories === [] ==> 全类目
        const categories = (isArray(o.categories) && o.categories.length === 0)
          ? allCategories.map(c => c.name)
          : o.categories
        // NOTE: areas === [] ==> 全国
        const areas = (isArray(o.areas) && o.areas.length === 0)
          ? allAreas.map(a => a.name)
          : o.areas

        for (const a of areas) {
          for (const c of categories) {
            const k = a + '-' + c
            if (rowInfo[k]) {
              rowInfo[k].push(o.timeRange)
            } else {
              rowInfo[k] = [o.timeRange]
            }
          }
        }
      }

      const rows = Object.keys(rowInfo).filter(k => {
        const [a, c] = k.split('-')
        return this.validCategories.includes(c) &&
          this.validAreas.includes(a)
      })
        .map((k) => ({
          category: k.split('-')[1],
          area: k.split('-')[0],
          ranges: rowInfo[k]
        }))

      if (rows.length) {
        this.$emit('conflict')
      }

      return rows
    },
    days () {
      const { options } = this
      const seconds = (options.end - options.start) || 0
      const num = ((seconds / 60 / 60 / 24) + 1) | 0
      const start = dayjs(options.start * 1000).format('YYYY-MM-DD')

      const days = []
      for (let i = 0; i <= num; i++) {
        const d = dayjs(start, 'YYYY-MM-DD').add(i, 'day')
        days.push(d.format('YYYY-MM-DD'))
      }

      return days
    },
    hasData () {
      return !!this.rows.length
    }
  },
  methods: {
    formatCategory (v) {
      const { allCategories } = this
      return getCnName(v, allCategories)
    },
    formatArea (v) {
      const { allAreas } = this
      return getCnName(v, allAreas)
    }
  },
  updated () {
    console.debug('ad calendar updated')
  }
}
</script>

<style lang="scss" scoped>
.calendar {
  padding: 30px;

  & > div {
    @include center;
    margin: 10px 0;
    font-size: 18px;
    color: gray;
  }

  & > header {
    display: flex;
    align-items: center;

    & > span:first-child {
      height: 59px;
      border-bottom: 1px solid #a3b2c4;
      border-left: 1px solid #a3b2c4;
      border-top: 1px solid #a3b2c4;
      background: #eef1f6;
    }

    & > span {
      display: flex;
      align-items: center;

      & > label {
        display: flex;
        align-items: center;
        padding-left: 10px;
        min-width: 100px;
        height: 100%;
      }

      & > label:last-child {
        border-left: 1px solid #a3b2c4;
      }
    }
  }

  & > main {
    & > div {
      display: flex;
      align-items: center;
      margin: 5px 0;

      & > span:first-child {
        height: 28px;
        border-bottom: 1px solid #a3b2c4;
        border-left: 1px solid #a3b2c4;
        border-top: 1px solid #a3b2c4;
        background: #eef1f6;
      }

      & > span {
        display: flex;
        align-items: center;

        & > label {
          @include wordline;
          display: flex;
          align-items: center;
          padding: 0 10px;
          height: 100%;
          min-width: 100px;
          max-width: 100px;
          font-size: 14px;
        }

        & > label:last-child {
          border-left: 1px solid #a3b2c4;
        }
      }
    }
  }
}
</style>
