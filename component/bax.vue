
<template>
  <content v-loading.fullscreen="fullscreenLoading">
    <sidebar :user-info="currentUser" />
    <router-view :userInfo="currentUser"
      :allCategories="allCategories"
      :allAreas="allAreas"
      :allRoles="allRoles" />
    <reset-email :visible="emailMissing" :uid="currentUser.id" />
  </content>
</template>

<script>

import ResetEmail from './common/reset-email'
import Sidebar from './sidebar'

import store from './store'

import es from 'base/es'

import {
  getCurrentUser,
  getCategories,
  getAreas,
  getRoles
} from './action'

export default {
  name: 'bax',
  store,
  components: {
    ResetEmail,
    Sidebar
  },
  data() {
    return {
      pending: 0
    }
  },
  computed: {
    fullscreenLoading() {
      return this.pending > 0
    }
  },
  async beforeMount() {
    // 全局只 mount 一次, 无需 remove listener
    es.addListener('http fetch start', () => {
      this.pending = this.pending + 1
    })

    es.addListener('http fetch end', () => {
      this.pending = this.pending - 1
    })
  },
  async mounted() {
    await Promise.all([
      getCurrentUser(),
      getCategories(),
      getAreas(),
      getRoles()
    ])
  }
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

<style>

.el-loading-mask {
  background-color: unset;
  z-index: unset;
  top: 240px;
  bottom: unset;
  height: 100px;
}

</style>
