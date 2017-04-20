
<template>
  <div class="ad-calendar">
    <topbar :userInfo="userInfo">
      <label slot="title">广告排期</label>
    </topbar>
    <ad-header />
    <main>
      TODO
    </main>
  </div>
</template>

<script>

import Topbar from 'com/topbar'
import AdHeader from './header'

import store from './store'

export default {
  name: 'ad-calendar',
  store,
  components: {
    AdHeader,
    Topbar
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  }
}

</script>

<style scoped>

.ad-calendar {
  padding: 0 35px;
}

</style>
