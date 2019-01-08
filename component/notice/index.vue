<template>
  <div>
    <ul class="notice-list">
      <li
        :key="notice.id"
        class="notice-item"
        v-for="notice in noticeList"
      >
        <p class="content">{{notice.content}}</p>
        <div class="date">{{notice.ts | fmtTime}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import moment from 'moment'
import { getFengmingNotice } from 'api/fengming'

export default {
  name: 'qwt-notice',
  async created() {
    this.noticeList = await getFengmingNotice()
  },
  data() {
    return {
      noticeList: null
    }
  },
  filters: {
    fmtTime(ts) {
      return moment(new Date(ts * 1000)).format('YYYY-MM-DD hh:mm')
    }
  }
}
</script>

<style scoped lang="postcss">
  .notice-list {
    padding: 30px 20px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 9px 0 rgba(83, 95, 127, .10);
  }
  .notice-item {
    padding-top: 16px;
    padding-bottom: 8px;
    padding-right: 20px;
    border-bottom: 1px solid #f0f0f0;
  }
  .content {
    color: #333;
    font-size: 16px;
  }
  .date {
    color: #aaa;
    font-size: 13px;
    text-align: right;
  }
</style>
