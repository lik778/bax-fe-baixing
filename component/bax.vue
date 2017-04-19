
<template>
  <content>
    <sidebar />
    <router-view :userInfo="currentUser"
      :allCategories="allCategories"
      :allAreas="allAreas"
      :allRoles="allRoles" />
  </content>
</template>

<script>

import Sidebar from './sidebar'

import store from './store'

import {
  getCurrentUser,
  getCategories,
  getAreas,
  getRoles
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
      getAreas(),
      getRoles()
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
