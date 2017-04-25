
<template>
  <div class="ad-calendar">
    <topbar :userInfo="userInfo">
      <label slot="title">广告排期</label>
    </topbar>
    <ad-header :all-categories="allCategories" :all-areas="allAreas"
      :all-ads="ads" />
    <main>
      TODO
    </main>
  </div>
</template>

<script>

import Topbar from 'com/topbar'
import AdHeader from './header'

import store from './store'

import {
  getAds
} from './action'

export default {
  name: 'ad-calendar',
  store,
  components: {
    AdHeader,
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
}

</style>
