
<template>
  <content>
    <sidebar></sidebar>
    <router-view :userInfo="currentUser"
      :allCategories="allCategories"
      :allAreas="allAreas">
    </router-view>
  </content>
</template>

<script>

import Sidebar from './sidebar'

import store from './store'

import Sidebar from './sidebar'

import {
  getCurrentUser,
  getCategories,
  getAreas
} from './action'

export default {
  name: 'bax',
  components: {
    Sidebar
  },
  data() {
    return {
    }
  },
  async mounted() {
    await Promise.all([
      getCurrentUser(),
      getCategories(),
      getAreas()
    ])
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
