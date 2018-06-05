
<template>
  <div class="ad-calendar">
    <topbar :userInfo="userInfo">
      <label slot="title">广告排期</label>
    </topbar>
    <calendar-header
      :all-categories="allCategories"
      :all-areas="allAreas"
      :all-ads="ads"
      :user-info="userInfo"
    />
    <calendar-main
      :orders="orders"
      :options="calendarOptions"
      :all-categories="allCategories"
      :all-areas="allAreas"
    />
  </div>
</template>

<script>
import CalendarMain from 'com/common/ad-calendar'
import CalendarHeader from './header'
import Topbar from 'com/topbar'

import store from './store'

export default {
  name: 'calendar',
  components: {
    CalendarHeader,
    CalendarMain,
    Topbar
  },
  fromMobx: {
    calendarOptions: () => store.calendarOptions,
    orders: () => store.orders,
    ads: () => store.ads
  },
  props: {
    allCategories: {
      type: Array,
      required: true
    },
    allAreas: {
      type: Array,
      required: true
    },
    userInfo: {
      type: Object,
      required: true
    }
  },
  beforeDestroy() {
    store.clearStore()
  },
  async mounted() {
    await store.getAds()
  }
}
</script>

<style scoped>
.ad-calendar {
  padding: 0 35px;
  width: 100%;
}
</style>
