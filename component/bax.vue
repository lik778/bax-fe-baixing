
<template>
  <content>
    <sidebar></sidebar>
    <router-view :userInfo="currentUser"></router-view>
  </content>
</template>

<script>

import { getCurrentUser } from './action'
import store from './store'

import Sidebar from './sidebar'

export default {
  name: 'bax',
  components: {
    Sidebar
  },
  data() {
    return {
    }
  },
  mounted() {
    getCurrentUser()
  },
  store
}

</script>

<style>

@import 'cssbase/reset';

</style>

<style scoped>

content {
  display: flex;
  width: 100%;
  height: 100%;

  & > div:last-child {
    flex-grow: 1;
  }
}

</style>
