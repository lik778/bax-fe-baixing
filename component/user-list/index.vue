
<template>
  <div class="user">
    <topbar :userInfo="userInfo">
      <label slot="title">客户管理</label>
    </topbar>
    <user-header @create-user="showCreateUserDialog = true"
      @created="onCreateUser" />
    <user-list :users="users" :offset="offset"
      :limit="limit" :total="total" />
    <create-user :visible="showCreateUserDialog"
      @hide="showCreateUserDialog = false" />
  </div>
</template>

<script>

import UserHeader from './header'
import CreateUser from './create'
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
