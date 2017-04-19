
<template>
  <div class="ad-group">
    <topbar :userInfo="userInfo">
      <label slot="title">投放管理</label>
    </topbar>
    <group-header />
    <group-list :groups="groups" :materials="materials"
      :all-categories="allCategories" :all-areas="allAreas"
      :offset="offset" :limit="limit" :total="total" />
  </div>
</template>

<script>

import GroupHeader from './header'
import Topbar from 'com/topbar'
import GroupList from './list'

import store from './store'

import {
  getAdGroups
} from './action'

export default {
  name: 'ad-group',
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
    GroupHeader,
    GroupList,
    Topbar
  },
  async mounted() {
    await getAdGroups()
  }
}

</script>

<style scoped>

.ad-group {
  padding: 0 35px;
}

</style>
