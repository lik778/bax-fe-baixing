
<template>
  <main class="sidebar">
    <header>
      <p>BAX</p>
      <p>v{{ version }}</p>
    </header>
    <content>
      <el-menu default-active="0">
        <el-menu-item index="0">
          <router-link :to="{ name: 'root' }" tag="p">
            <i class="el-icon-menu"></i>首页
          </router-link>
        </el-menu-item>
        <el-submenu index="1" v-if="allowSeeGw">
          <template slot="title">
            <i class="el-icon-star-on"></i>建站工具
          </template>
          <el-menu-item index="1-1">
            <router-link :to="{ name: 'gw-charge' }" tag="p">
              企业官网
            </router-link>
          </el-menu-item>
          <el-menu-item index="1-2">
            <router-link :to="{ name: 'gw-custom-page' }" tag="p">
              单页定制
            </router-link>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-star-on"></i>全网通
          </template>
          <el-menu-item index="2-1">
            <router-link :to="{ name: 'qwt-charge' }" tag="p">
              服务开启
            </router-link>
          </el-menu-item>
          <el-menu-item index="2-2" v-if="allowSeeQwtPromotion">
            <router-link :to="{ name: 'qwt-create-promotion' }" tag="p">
              新建推广
            </router-link>
          </el-menu-item>
          <el-menu-item index="2-3" v-if="allowSeeQwtPromotion">
            <router-link :to="{ name: 'qwt-promotion-list' }" tag="p">
              推广管理
            </router-link>
          </el-menu-item>
          <el-menu-item index="2-4" v-if="allowSeeQwtReport">
            <router-link :to="{ name: 'qwt-dashboard' }" tag="p">
              数据报表
            </router-link>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-message"></i>品牌广告
          </template>
          <el-menu-item index="3-1" v-if="allowQueryAdItems">
            <router-link :to="{ name: 'ad-list' }" tag="p">
              广告投放
            </router-link>
          </el-menu-item>
          <el-menu-item index="3-2" v-if="allowQueryMaterials">
            <router-link :to="{ name: 'material-list' }" tag="p">
              物料管理
            </router-link>
          </el-menu-item>
          <el-menu-item index="3-3" v-if="allowQueryOrders">
            <router-link :to="{ name: 'order-list' }" tag="p">
              订单管理
            </router-link>
          </el-menu-item>
          <el-menu-item index="3-4" v-if="allowQueryUsers">
            <router-link :to="{ name: 'user-list' }" tag="p">
              客户管理
            </router-link>
          </el-menu-item>
          <el-menu-item index="3-5">
            <router-link :to="{ name: 'ad-calendar' }" tag="p">
              广告排期
            </router-link>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="4" v-if="allowSeeDashboard">
          <router-link :to="{ name: 'dashboard' }" tag="p">
            <i class="el-icon-menu"></i>部门业绩
          </router-link>
        </el-menu-item>
        <el-menu-item index="5" v-if="allowSeeAccount">
          <router-link :to="{ name: 'account' }" tag="p">
            <i class="el-icon-menu"></i>账户
          </router-link>
        </el-menu-item>
        <el-menu-item index="6">
          <i class="el-icon-setting"></i>设置
        </el-menu-item>
      </el-menu>
    </content>
  </main>
</template>

<script>

import { version } from '../../package.json'

import {
  allowSeeQwtPromotion,
  allowSeeQwtReport,
  allowSeeQwtCharge,
  allowSeeGw
} from 'util/fengming-role'

import {
  // bx ad
  allowQueryMaterials,
  allowQueryAdItems,
  allowQueryOrders,
  allowQueryUsers,
  // global
  allowSeeDashboard,
  allowSeeAccount
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
    },
    //
    allowSeeDashboard() {
      return allowSeeDashboard(this.userInfo.roles)
    },
    allowSeeAccount() {
      return allowSeeAccount(this.userInfo.roles)
    },
    //
    allowSeeQwtPromotion() {
      return allowSeeQwtPromotion(this.userInfo.roles)
    },
    allowSeeQwtCharge() {
      return allowSeeQwtCharge(this.userInfo.roles, this.userInfo.id)
    },
    allowSeeQwtReport() {
      return allowSeeQwtReport(this.userInfo.roles)
    },
    allowSeeGw() {
      return allowSeeGw(this.userInfo.roles, this.userInfo.id)
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
