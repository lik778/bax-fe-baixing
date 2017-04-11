
<template>
  <div>
    <topbar :userInfo="userInfo">
      <label slot="title">客户管理</label>
    </topbar>
    <user-list :users="users"></user-list>
  </div>
</template>

<script>

import Topbar from 'com/topbar'
import UserList from './list'

import store from './store'

export default {
  name: 'user',
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  components: {
    UserList,
    Topbar
  },
  store
}

</script>

<style scoped>

div {
  padding: 0 35px;
}

</style>
