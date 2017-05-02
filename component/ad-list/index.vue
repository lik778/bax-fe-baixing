
<template>
  <div class="ad">
    <topbar :userInfo="userInfo">
      <label slot="title">投放管理</label>
    </topbar>
    <ad-header :query="query" :ads="ads" />
    <ad-list :materials="materials"
      :items="items" :query="query"
      :all-categories="allCategories"
      :all-areas="allAreas" />
  </div>
</template>

<script>

import AdHeader from './header'
import Topbar from 'com/topbar'
import AdList from './list'

import store from './store'

import {
  getAdItems,
  getAds
} from './action'

export default {
  name: 'ad',
  store,
  props: {
    userInfo: {
      type: Object,
      required: true
    },
    allCategories: {
      type: Array,
      required: true
    },
    allAreas: {
      type: Array,
      required: true
    }
  },
  components: {
    AdHeader,
    AdList,
    Topbar
  },
  async mounted() {
    await Promise.all([
      getAdItems(),
      getAds()
    ])
  }
}

</script>

<style scoped>

.ad {
  padding: 0 35px;
}

</style>
