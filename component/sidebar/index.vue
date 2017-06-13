
<template>
  <main class="sidebar">
    <header>
      <p>BAX SSP</p>
      <p>v{{ version }}</p>
    </header>
    <content>
      <el-menu default-active="1">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-message" />全网通
          </template>
          <el-menu-item index="1-1">
            <router-link :to="{ name: 'ad-list' }" tag="p">
              todo
            </router-link>
          </el-menu-item>
          <el-menu-item index="1-2">
            <router-link :to="{ name: 'ad-list' }" tag="p">
              todo
            </router-link>
          </el-menu-item>
          <el-menu-item index="1-3">
            <router-link :to="{ name: 'ad-list' }" tag="p">
              todo
            </router-link>
          </el-menu-item>
          <el-menu-item index="1-4">
            <router-link :to="{ name: 'ad-list' }" tag="p">
              todo
            </router-link>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-message" />品牌广告
          </template>
          <el-menu-item index="1-1" v-if="allowQueryAdItems">
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
        <el-menu-item index="4">
          <i class="el-icon-menu" />设置
        </el-menu-item>
        <el-menu-item index="5">
          <i class="el-icon-setting" />账户
        </el-menu-item>
      </el-menu>
    </content>
  </main>
</template>

<script>

import { version } from '../../package.json'

import {
  allowQueryMaterials,
  allowQueryAdItems,
  allowQueryOrders,
  allowQueryUsers
} from 'util/role'

export default {
  name: 'sidebar',
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      version
    }
  },
  computed: {
    allowQueryMaterials() {
      return allowQueryMaterials(this.userInfo.roles)
    },
    allowQueryAdItems() {
      return allowQueryAdItems(this.userInfo.roles)
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
  & > header {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    padding-top: 5px;
    height: 90px;

    & > p:first-child {
      font-size: 20px;
      color: #768396;
    }

    & > p:last-child {
      font-size: 12px;
      color: gray;
    }
  }

  min-width: 140px;
  width: 140px;
  height: 600px;
  background: var(--c-gray);
}

</style>
