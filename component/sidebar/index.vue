
<template>
  <div class="sidebar">
    <header>
      <p>广告系统</p>
      <p>v{{ version }}</p>
    </header>
    <main>
      <el-menu
        :default-active="defaultActive"
        :default-openeds="defaultOpeneds"
        background-color="#2e394b"
        active-text-color="rgb(255, 208, 75)"
        text-color="#e1e4ee"
        ref="menu"
       >
        <el-menu-item index="root">
          <router-link :to="{ name: 'root' }" tag="p">
            <bx-icon type="appstore"></bx-icon>首页
          </router-link>
        </el-menu-item>

        <el-menu-item index="charge">
          <router-link :to="{ name: 'qwt-charge' }" tag="p">
            <bx-icon type="paycircleo"></bx-icon>产品购买
          </router-link>
        </el-menu-item>

        <el-menu-item index="gw-charge" v-if="allowUseKaPackage">
          <p @click="toBuyKaOrGw">
            <bx-icon type="book"></bx-icon>官网购买
          </p>
        </el-menu-item>

        <el-submenu index="qwt-campaign" v-if="allowSeeQwtPromotion">
          <template slot="title">
            <bx-icon type="sharealt"></bx-icon>站外推广
          </template>
          <el-menu-item index="qwt-create-promotion">
            <router-link :to="{ name: 'qwt-create-promotion' }" tag="p">
              新建推广计划
            </router-link>
          </el-menu-item>
          <el-menu-item index="qwt-promotion-list">
            <router-link :to="{ name: 'qwt-promotion-list' }" tag="p">
              管理推广计划
            </router-link>
          </el-menu-item>
          <el-menu-item index="qwt-dashboard">
            <router-link :to="{ name: 'qwt-dashboard' }" tag="p">
              数据报表
            </router-link>
          </el-menu-item>
        </el-submenu>

        <!-- <el-menu-item index="bax" v-if="allowSeeQwtPromotion">
          <router-link :to="{ name: 'root' }" tag="p">
            <i class="material-icons" style="font-size: 16px; margin-right: 11px; vertical-align: -3px;">dvr</i>标王推广
          </router-link>
        </el-menu-item> -->

        <el-submenu index="mvp-campaign" v-if="allowSeeQwtPromotion">
          <template slot="title">
            <bx-icon type="link"></bx-icon>智能投放
          </template>
          <el-menu-item index="mvp-create-campaign">
            <router-link :to="{ name: 'mvp-create-campaign' }" tag="p">
              新建智能推广
            </router-link>
          </el-menu-item>
          <el-menu-item index="mvp-campaign-list">
            <router-link :to="{ name: 'mvp-campaign-list' }" tag="p">
              管理智能推广
            </router-link>
          </el-menu-item>
          <el-menu-item index="mvp-dashboard">
            <router-link :to="{ name: 'mvp-dashboard' }" tag="p">
              数据报表
            </router-link>
          </el-menu-item>
        </el-submenu>


        <el-submenu index="ssp" v-if="allowSeeBxAd">
          <template slot="title">
            <i class="el-icon-message"></i>品牌广告
          </template>
          <el-menu-item index="ad-list" v-if="allowQueryAdItems">
            <router-link :to="{ name: 'ad-list' }" tag="p">
              广告投放
            </router-link>
          </el-menu-item>
          <el-menu-item index="material-list" v-if="allowQueryMaterials">
            <router-link :to="{ name: 'material-list' }" tag="p">
              物料管理
            </router-link>
          </el-menu-item>
          <el-menu-item index="order-list" v-if="allowQueryOrders">
            <router-link :to="{ name: 'order-list' }" tag="p">
              订单管理
            </router-link>
          </el-menu-item>
          <el-menu-item index="user-list" v-if="allowQueryUsers">
            <router-link :to="{ name: 'user-list' }" tag="p">
              客户管理
            </router-link>
          </el-menu-item>
          <el-menu-item index="ad-calendar">
            <router-link :to="{ name: 'ad-calendar' }" tag="p">
              广告排期
            </router-link>
          </el-menu-item>
        </el-submenu>

        <el-menu-item index="account" v-if="allowSeeAccount">
          <router-link :to="{ name: 'account' }" tag="p">
            <bx-icon type="user"></bx-icon>我的账户
          </router-link>
        </el-menu-item>
        <el-menu-item index="operation-log" v-if="allowSeeAccount">
          <router-link :to="{ name: 'operation-log' }" tag="p">
            <bx-icon type="inbox"></bx-icon>操作日志
          </router-link>
        </el-menu-item>

        <el-submenu index="qa">
          <template slot="title">
            <bx-icon type="questioncircleo"></bx-icon>答疑解惑
          </template>
          <el-menu-item index="qa-1">
            <a class="link" target="_blank" href="/qa?mode=tutorials">
              操作指南
            </a>
          </el-menu-item>
          <el-menu-item index="qa-2">
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
  allowUseKaPackage
} from 'util/fengming-role'

import {
  // bx ad
  allowQueryMaterials,
  allowQueryAdItems,
  allowQueryOrders,
  allowQueryUsers,
  // global
  allowSeeAccount,
  allowSeeBxAd
} from 'util/role'


const MENU_GROUP_MAP = {
  'qwt-charge': ['qwt-charge-buy-service', 'qwt-charge-charge-only', 'gw-charge'],
  'qwt-campaign': ['qwt-create-promotion', 'qwt-promotion-list', 'qwt-dashboard'],
  'mvp-campaign': ['mvp-create-campaign', 'mvp-campaign-list', 'mvp-dashboard'],
  'ssp': ['ad-list', 'material-list', 'order-list', 'user-list', 'ad-calendar']
}


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
      version,
      defaultActive: null,
      defaultOpeneds: null
    }
  },
  watch: {
    $route(route) {
      if(route.name === 'qwt-charge') {
        this.$refs.menu.activeIndex = `${route.name}-${route.query.mode}`
      } else {
        this.$refs.menu.activeIndex = route.name
      }
    }
  },
  computed: {
    allowUseKaPackage() {
      // 合并产品购买和充值后，只有几个大客户可以看到官网单独购买入口
      return allowUseKaPackage(this.userInfo.roles, this.userInfo.id)
    },
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
    allowSeeAccount() {
      return allowSeeAccount(this.userInfo.roles)
    },
    allowSeeBxAd() {
      return allowSeeBxAd(this.userInfo.roles)
    },
    // allow see qwt ...
    allowSeeQwtPromotion() {
      return allowSeeQwtPromotion(this.userInfo.roles)
    }
  },
  methods: {
    _initNavMenu() {
      const route = this.$route
      let defaultActive = route.name

      if(route.name === 'qwt-charge') {
        defaultActive = `${route.name}-${route.query.mode}`
      }

      this.defaultOpeneds = Object.entries(MENU_GROUP_MAP).reduce((defaultOpeneds, [group_index, group]) => {
        if(group.some(item => item === defaultActive)) {
          return defaultOpeneds.concat(group_index)
        }
        return defaultOpeneds
      }, [])
      this.defaultActive = defaultActive
    },
    toBuyKaOrGw() {
      const q = this.$route.query

      this.$router.push({
        name: 'gw-charge',
        query: {
          ...q
        }
      })
    }
  },
  created() {
    this._initNavMenu()
  }
}
</script>

<style lang="postcss" scoped>
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
    min-height: 50px;
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
}

.el-menu-item {
  min-width: unset;
  padding-right: 0;
}

.el-menu, .el-submenu {
  border: 1px solid #273141;
}
</style>

<style>
.sidebar .el-menu-item, .el-submenu__title {
  height: 48px;
  line-height: 48px;
}
</style>
