
<template>
  <span>
    <section>
      <p v-for="d in days">
        {{ d | day }}
      </p>
    </section>
    <section>
      <p v-for="d in days" :title="d">
        {{ d | date }}
      </p>
    </section>
  </span>
</template>

<script>

import moment from 'moment'

export default {
  name: 'ad-calendar-days-tip',
  props: {
    days: {
      type: Array,
      required: true
    }
  },
  filters: {
    date(s) {
      return moment(s, 'YYYY-MM-DD').date()
    },
    day(s) {
      const d = moment(s, 'YYYY-MM-DD').day()

      const m = {
        '0': '日',
        '1': '一',
        '2': '二',
        '3': '三',
        '4': '四',
        '5': '五',
        '6': '六'
      }

      return m[String(d)] || d
    }
  }
}

</script>

<style scoped>

@import 'cssbase/mixin';

span {
  display: flex;
  flex-flow: column;

  & > section {
    display: flex;

    & > p {
      @mixin center;

      width: 25px;
      height: 25px;
      border-top: 1px solid #a3b2c4;
      border-left: 1px solid #a3b2c4;
      border-bottom: 1px solid #a3b2c4;

      &:last-child {
        border-right: 1px solid #a3b2c4;
      }
    }
  }
}

</style>
