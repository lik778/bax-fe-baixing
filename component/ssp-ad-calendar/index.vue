
<template>
  <div class="ad-calendar">
    <topbar :userInfo="userInfo">
      <label slot="title">广告排期</label>
    </topbar>
    <calendar-header :all-categories="allCategories" :all-areas="allAreas"
      :all-ads="ads" :user-info="userInfo">
    </calendar-header>
    <calendar-main :orders="orders" :options="calendarOptions"
      :all-categories="allCategories" :all-areas="allAreas">
    </calendar-main>
  </div>
</template>

<script>

import CalendarHeader from './header'
import CalendarMain from './calendar'
import Topbar from 'com/topbar'

import store from './store'

import {
  clearStore,
  getAds
} from './action'

export default {
  name: 'calendar',
  store,
  components: {
    CalendarHeader,
    CalendarMain,
    Topbar
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
    clearStore()
  },
  async mounted() {
    await Promise.all([
      getAds()
    ])
  }
}

</script>

<style scoped>

.ad-calendar {
  padding: 0 35px;
  width: 100%;
}

</style>
