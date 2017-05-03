
<template>
  <div class="user">
    <topbar :userInfo="userInfo">
      <label slot="title">客户管理</label>
    </topbar>
    <user-header v-if="allowAddUser"
      @create-user="showCreateUserDialog = true"
      :query="query" />
    <user-list :users="users" :all-roles="allRoles" :query="query" />
    <create-user :visible="showCreateUserDialog"
      :all-roles="allRoles"
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
  // allowQueryUsers
  allowAddUser // 目前: 两者权限一样
} from 'constant/role'

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
  computed: {
    allowAddUser() {
      return allowAddUser(this.userInfo.roles)
    }
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
