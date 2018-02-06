
<template>
  <div class="sidebar">
    <header>
      <p>广告系统</p>
      <p>v{{ version }}</p>
    </header>
    <main>
      <el-menu default-active="0"
        :default-openeds="['1', '2', '3', '6', '9']">
        <el-menu-item index="0">
          <router-link :to="{ name: 'root' }" tag="p">
            <bx-icon type="appstore"></bx-icon>首页
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
            <div class="menu-main-title">
              <bx-icon type="paycircleo"></bx-icon>产品购买
            </div>
          </template>
          <el-menu-item index="2-1">
            <p @click="toBuyService">
              套餐购买
            </p>
          </el-menu-item>
          <el-menu-item index="2-2">
            <p @click="toChargeOnly">
              资金充值
            </p>
          </el-menu-item>
        </el-submenu>

        <el-submenu index="3" v-if="allowSeeQwtPromotion">
          <template slot="title">
            <div class="menu-main-title">
              <bx-icon type="sharealt"></bx-icon>广告投放
            </div>
          </template>
          <el-menu-item index="3-1">
            <router-link :to="{ name: 'qwt-create-promotion' }" tag="p">
              新建推广计划
            </router-link>
          </el-menu-item>
          <el-menu-item index="3-2">
            <router-link :to="{ name: 'qwt-promotion-list' }" tag="p">
              管理推广计划
            </router-link>
          </el-menu-item>
        </el-submenu>

        <el-menu-item index="4" v-if="allowSeeQwtReport">
          <router-link :to="{ name: 'qwt-dashboard' }" tag="p">
            <bx-icon type="barchart"></bx-icon>数据报表
          </router-link>
        </el-menu-item>

        <el-menu-item index="5">
          <router-link :to="{ name: 'qwt-cashcow' }" tag="p">
            <bx-icon type="iconfontdesktop"></bx-icon>微站
          </router-link>
        </el-menu-item>

        <el-submenu index="6" v-if="allowSeeBxAd">
          <template slot="title">
            <i class="el-icon-message"></i>品牌广告
          </template>
          <el-menu-item index="6-1" v-if="allowQueryAdItems">
            <router-link :to="{ name: 'ad-list' }" tag="p">
              广告投放
            </router-link>
          </el-menu-item>
          <el-menu-item index="6-2" v-if="allowQueryMaterials">
            <router-link :to="{ name: 'material-list' }" tag="p">
              物料管理
            </router-link>
          </el-menu-item>
          <el-menu-item index="6-3" v-if="allowQueryOrders">
            <router-link :to="{ name: 'order-list' }" tag="p">
              订单管理
            </router-link>
          </el-menu-item>
          <el-menu-item index="6-4" v-if="allowQueryUsers">
            <router-link :to="{ name: 'user-list' }" tag="p">
              客户管理
            </router-link>
          </el-menu-item>
          <el-menu-item index="6-5">
            <router-link :to="{ name: 'ad-calendar' }" tag="p">
              广告排期
            </router-link>
          </el-menu-item>
        </el-submenu>

        <el-menu-item index="7" v-if="allowSeeDashboard">
          <router-link :to="{ name: 'dashboard' }" tag="p">
            <i class="el-icon-menu"></i>部门业绩
          </router-link>
        </el-menu-item>

        <el-menu-item index="8" v-if="allowSeeAccount">
          <router-link :to="{ name: 'account' }" tag="p">
            <bx-icon type="user"></bx-icon>我的账户
          </router-link>
        </el-menu-item>

        <el-submenu index="9">
          <template slot="title">
            <div class="menu-main-title">
              <bx-icon type="questioncircleo"></bx-icon>答疑解惑
            </div>
          </template>
          <el-menu-item index="9-1">
            <a class="link" target="_blank" href="/qa?mode=tutorials">
              操作指南
            </a>
          </el-menu-item>
          <el-menu-item index="9-2">
            <a class="link" target="_blank" href="/qa?mode=questions">
              常见问题
            </a>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </main>
  </div>
</template>

<script>
import { version } from '../../package.json'
import BxIcon from 'com/widget/icon'

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
  components: {
    BxIcon
  },
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
  },
  methods: {
    toBuyService() {
      const q = this.$route.query

      this.$router.push({
        name: 'qwt-charge',
        query: {
          ...q,
          mode: 'buy-service'
        }
      })
    },
    toChargeOnly() {
      const q = this.$route.query

      this.$router.push({
        name: 'qwt-charge',
        query: {
          ...q,
          mode: 'charge-only'
        }
      })
    }
  }
}
</script>

<style scoped>
@import '../../cssbase/var';

.iconfont {
  margin-right: 13px;
  font-size: 14px;
}

.link {
  display: inline-flex;
  align-items: center;
  color: #e1e4ee;
  cursor: pointer;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 6666;
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

.el-menu, .el-submenu {
  background-color: unset;
  border: 1px solid #273141;
  color: #e1e4ee;
}

.el-menu-item, .el-menu-item:hover {
  background-color: #2e394b;
  color: #e1e4ee;

  & > p, & > a {
    padding-left: 6px;
  }
}

.menu-main-title {
  color: #e1e4ee;
}
</style>

<style>
.sidebar .el-submenu .el-menu-item:hover,
.sidebar .el-submenu__title:hover {
  background-color: #2e394b;
}

.sidebar .el-menu-item, .el-submenu__title {
  height: 48px;
  line-height: 48px;
}
</style>
