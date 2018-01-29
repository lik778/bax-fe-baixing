
<template>
  <div class="sidebar">
    <header>
      <p>广告系统</p>
      <p>v{{ version }}</p>
    </header>
    <main>
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
          <el-menu-item index="2-5">
            <router-link :to="{ name: 'qwt-cashcow' }" tag="p">
              微站
            </router-link>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="3" v-if="allowSeeBxAd">
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
          <a class="link" target="_blank" href="/qa">
            <i class="el-icon-search"></i>
            <label>答疑解惑</label>
          </a>
        </el-menu-item>
      </el-menu>
    </main>
  </div>
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
  allowSeeAccount,
  allowSeeBxAd
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
    // allow see bx ad ...
    allowSeeDashboard() {
      return allowSeeDashboard(this.userInfo.roles)
    },
    allowSeeAccount() {
      return allowSeeAccount(this.userInfo.roles)
    },
    allowSeeBxAd() {
      return allowSeeBxAd(this.userInfo.roles)
    },
    // allow see qwt ...
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

.link {
  display: inline-flex;
  align-items: center;
  color: #48576a;
}

.sidebar {
  display: flex;
  flex-flow: column;
  background: #2e394b;
  min-width: 180px;
  width: 180px;

  & > header {
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 20px;
    color: white;

    & p {
      height: 25px;
    }

    & p:first-child {
      opacity: 0.9;
      font-size: 18px;
      letter-spacing: 0.8px;
    }

    & p:last-child {
      display: flex;
      align-items: flex-end;
      margin-left: 10px;
      font-size: 12px;
      padding-bottom: 1px;
    }
  }

  & > main {

  }
}

.el-menu-item {
  min-width: unset;
}

.el-menu, .el-submenu .el-menu {
  background-color: unset;
  /* background-color: #2e394b !important; */
}

.el-menu-item, .el-submenu__title {
  color: #e1e4ee;
}

.homepage {
  display: flex;
  align-items: center;
  height: 50px;
  font-size: 14px;
  line-height: 1;
  letter-spacing: 0.4px;
  padding-left: 22px;
  color: #e1e4ee;
  border: 1px solid #273141;

  & > label {
    margin-left: 14px;
  }
}

</style>
