
<template>
  <div class="ad">
    <topbar :userInfo="userInfo">
      <label slot="title">投放管理</label>
    </topbar>
    <ad-header :query="query" :ads="ads"
      :showMoreFilters="showMoreFilters">
    </ad-header>
    <ad-list :materials="materials"
      :items="items" :query="query"
      :all-categories="allCategories"
      :all-areas="allAreas"
      :user-info="userInfo">
    </ad-list>
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
  components: {
    AdHeader,
    AdList,
    Topbar
  },
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
  async mounted() {
    await Promise.all([
      getAdItems({...this.query}),
      getAds()
    ])
  }
}
</script>

<style scoped>

.ad {
  padding: 0 35px;
  width: 100%;
}

</style>
