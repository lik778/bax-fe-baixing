
<template>
  <div class="ad">
    <topbar :userInfo="userInfo">
      <label slot="title">投放管理</label>
    </topbar>
    <ad-header />
    <ad-list :items="items" :materials="materials"
      :all-categories="allCategories" :all-areas="allAreas"
      :offset="offset" :limit="limit" :total="total" />
  </div>
</template>

<script>

import AdHeader from './header'
import Topbar from 'com/topbar'
import AdList from './list'

import store from './store'

import {
  getAdItems
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
    await getAdItems()
  }
}

</script>

<style scoped>

.ad {
  padding: 0 35px;
}

</style>
