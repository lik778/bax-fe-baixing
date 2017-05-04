
<template>
  <main class="sidebar">
    <header>
      BAX SSP
    </header>
    <content>
      <el-menu default-active="1">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-message" />投放管理
          </template>
          <el-menu-item index="1-1">
            <router-link :to="{ name: 'ad-list' }" tag="p">
              广告投放
            </router-link>
          </el-menu-item>
          <el-menu-item index="1-2" v-if="allowQueryMaterials">
            <router-link :to="{ name: 'material-list' }" tag="p">
              物料管理
            </router-link>
          </el-menu-item>
          <el-menu-item index="1-3" v-if="allowQueryOrders">
            <router-link :to="{ name: 'order-list' }" tag="p">
              订单管理
            </router-link>
          </el-menu-item>
          <el-menu-item index="1-4" v-if="allowQueryUsers">
            <router-link :to="{ name: 'user-list' }" tag="p">
              客户管理
            </router-link>
          </el-menu-item>
          <el-menu-item index="1-5">
            <router-link :to="{ name: 'ad-calendar' }" tag="p">
              广告排期
            </router-link>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="1-1">
          <i class="el-icon-menu" />设置
        </el-menu-item>
        <el-menu-item index="1-1">
          <i class="el-icon-setting" />账户
        </el-menu-item>
      </el-menu>
    </content>
  </main>
</template>

<script>

import {
  allowQueryMaterials,
  allowQueryOrders,
  allowQueryUsers
} from 'constant/role'

export default {
  name: 'sidebar',
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  computed: {
    allowQueryMaterials() {
      return allowQueryMaterials(this.userInfo.roles)
    },
    allowQueryOrders() {
      return allowQueryOrders(this.userInfo.roles)
    },
    allowQueryUsers() {
      return allowQueryUsers(this.userInfo.roles)
    }
  }
}

</script>

<style scoped>

@import '../../cssbase/var';

.sidebar {
  & header {
    display: flex;
    justify-content: center;
    padding-top: 15px;
    height: 90px;
    font-size: 20px;
    color: #768396;
  }

  min-width: 180px;
  width: 180px;
  height: 100%;
  background: var(--c-gray);
}

</style>
