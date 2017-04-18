
<template>
  <div class="ad-group">
    <topbar :userInfo="userInfo">
      <label slot="title">投放管理</label>
    </topbar>
    <group-list :groups="groups"></group-list>
  </div>
</template>

<script>

import Topbar from 'com/topbar'
import GroupList from './list'

import store from './store'

import {
  getAdGroups,

  createAdGroup,
  // transferAdItems
} from './action'

export default {
  name: 'ad-group',
  store,
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  components: {
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
