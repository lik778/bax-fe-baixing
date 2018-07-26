
<template>
  <div class="user">
    <topbar :userInfo="userInfo">
      <label slot="title">客户管理</label>
    </topbar>
    <user-header
      :query="query"
      :all-roles="allRoles"
      @create-user="showCreateUserDialog = true"
    />
    <user-list
      :users="users"
      :all-roles="allRoles"
      :query="query"
    />
    <create-user
      :visible="showCreateUserDialog"
      :all-roles="allRoles"
      :user-info="userInfo"
      @created="onCreateUser"
      @hide="showCreateUserDialog = false"
    />
  </div>
</template>

<script>
import CreateUser from 'com/common/create-user'
import UserHeader from './header'
import Topbar from 'com/topbar'
import UserList from './list'

import store from './store'

export default {
  name: 'user',
  components: {
    CreateUser,
    UserHeader,
    UserList,
    Topbar
  },
  fromMobx: {
    query: () => store.query,
    users: () => store.users
  },
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
  methods: {
    async onCreateUser() {
      await store.getUsers()
    }
  }
}
</script>

<style lang="postcss" scoped>
.user {
  padding: 0 35px;
  width: 100%;
}
</style>
