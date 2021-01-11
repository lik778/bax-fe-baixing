
<template>
  <span>
    <section>
      <p v-for="(d, i) in days" :key="i">
        {{ d | day }}
      </p>
    </section>
    <section>
      <p v-for="(d, i) in days" :key="i" :title="d">
        {{ d | date }}
      </p>
    </section>
  </span>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'ad-calendar-days-tip',
  props: {
    days: {
      type: Array,
      required: true
    }
  },
  filters: {
    date (s) {
      return dayjs(s, 'YYYY-MM-DD').date()
    },
    day (s) {
      const d = dayjs(s, 'YYYY-MM-DD').day()

      const m = {
        0: '日',
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六'
      }

      return m[String(d)] || d
    }
  }
}
</script>

<style lang="scss" scoped>
span {
  display: flex;
  flex-flow: column;

  & > section {
    display: flex;

    & > p {
      @include center;

      width: 28px;
      height: 28px;
      border-top: 1px solid #a3b2c4;
      border-left: 1px solid #a3b2c4;
      border-bottom: 1px solid #a3b2c4;
      background: #eef1f6;

      &:last-child {
        border-right: 1px solid #a3b2c4;
      }
    }
  }

  & > section:not(:first-child) {
    margin-top: 3px;
  }
}
</style>
