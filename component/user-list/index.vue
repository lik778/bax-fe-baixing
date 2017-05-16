
<template>
  <div class="user">
    <topbar :userInfo="userInfo">
      <label slot="title">客户管理</label>
    </topbar>
    <user-header :query="query" :all-roles="allRoles"
      @create-user="showCreateUserDialog = true" />
    <user-list :users="users" :all-roles="allRoles" :query="query" />
    <create-user :visible="showCreateUserDialog"
      :all-roles="allRoles"
      :user-info="userInfo"
      @created="onCreateUser"
      @hide="showCreateUserDialog = false" />
  </div>
</template>

<script>

import CreateUser from 'com/common/create-user'
import UserHeader from './header'
import Topbar from 'com/topbar'
import UserList from './list'

import store from './store'

import {
  getUsers
} from './action'

export default {
  name: 'user',
  store,
  props: {
    userInfo: {
      type: Object,
      required: true
    },
    allRoles: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      showCreateUserDialog: false
    }
  },
  components: {
    CreateUser,
    UserHeader,
    UserList,
    Topbar
  },
  methods: {
    async onCreateUser() {
      await getUsers()
    }
  }
}

</script>

<style scoped>

.user {
  padding: 0 35px;
}

</style>
