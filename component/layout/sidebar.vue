
<template>
  <div class="sidebar">
    <main>
      <el-menu
        style="border: none;"
        :default-active="defaultActive"
        :default-openeds="defaultOpeneds"
        :unique-opened="true"
        background-color="#fff"
        active-text-color="#FF6350"
        text-color="#333"
        ref="menu"
       >
        <el-menu-item index="/ka/vendor/site" @click="goKaSuperPage" v-if="isKaSuperman">
          <i class="el-icon-info" />
          官网超人入口
        </el-menu-item>
        <el-menu-item index="root">
          <router-link :to="{ name: 'root' }" tag="p">
            <bx-icon type="appstore"></bx-icon>我的搜索通
          </router-link>
        </el-menu-item>

        <el-submenu index="charge">
          <template slot="title">
            <bx-icon type="paycircleo"></bx-icon>充值与购买
          </template>
          <el-menu-item index="qwt-charge">
            <router-link :to="{ name: 'qwt-charge' }" tag="p">
              站外推广
            </router-link>
          </el-menu-item>
          <el-menu-item index="seo-charge">
            <router-link :to="{ name: 'seo-charge' }" tag="p">
                首页宝
            </router-link>
          </el-menu-item>
        </el-submenu>

        <el-submenu index="seo">
          <template slot="title">
            <bx-icon type="paycircleo"></bx-icon>首页宝
          </template>
          <el-menu-item index="seo-create-promotion">
            <router-link :to="{ name: 'seo-create-promotion' }" tag="p">
              新建首页宝
            </router-link>
          </el-menu-item>
          <el-menu-item index="seo-promotion-list">
            <router-link :to="{ name: 'seo-promotion-list' }" tag="p">
              管理首页宝
            </router-link>
          </el-menu-item>
        </el-submenu>

        <el-menu-item index="gw-charge" v-if="allowUseKaPackage">
          <p @click="toBuyKaOrGw">
            <bx-icon type="book"></bx-icon>官网购买
          </p>
        </el-menu-item>

        <el-submenu index="sst" v-show="allowSeeQwtPromotion">
          <template slot="title">
            <bx-icon type="sharealt"></bx-icon>站外推广
          </template>
          <el-menu-item index="qwt-create-promotion">
            <router-link :to="{ name: 'qwt-create-promotion' }" tag="p">
              新建站外推广
            </router-link>
          </el-menu-item>
          <el-menu-item index="qwt-promotion-list">
            <router-link :to="{ name: 'qwt-promotion-list' }" tag="p">
              管理站外推广
            </router-link>
          </el-menu-item>
        </el-submenu>

        <el-submenu index="bw">
          <template slot="title">
            <bx-icon type="sharealt"></bx-icon>标王推广
          </template>
          <el-menu-item index="bw-query-price" v-if="!allowNotSeeBwNewPrice">
            <router-link :to="{ name: 'bw-query-price' }" tag="p">
              <i class="material-icons" style="font-size: 16px; margin-right: 11px; vertical-align: -3px;"></i>新建标王推广
            </router-link>
          </el-menu-item>
          <el-menu-item index="bw-plan-list">
            <router-link :to="{ name: 'bw-plan-list' }" tag="p">
              <i class="material-icons" style="font-size: 16px; margin-right: 11px; vertical-align: -3px;"></i>管理标王推广
            </router-link>
          </el-menu-item>
        </el-submenu>

        <el-menu-item index="gw-homepage">
          <a href="/ka/main" v-if="isRenderSiteLink" style="color: inherit">
            <i class="el-icon-news" />精品官网
            <i v-if="isRenderSiteNavTag" class="el-icon-question" />
          </a>
          <router-link :to="{name: 'gw-homepage'}" tag="p" v-else>
            <i class="el-icon-news" />精品官网
            <i v-if="isRenderSiteNavTag" class="el-icon-question" />
          </router-link>
        </el-menu-item>
        <el-menu-item index="qwt-dashboard">
          <router-link :to="{ name: 'qwt-dashboard' }" tag="p">
            <i class="el-icon-document" />数据报表
          </router-link>
        </el-menu-item>

        <el-submenu index="ssp" v-show="allowSeeBxAd">
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
  allowSeeBxAd,
  // bw
  allowNotSeeBwNewPrice
} from 'util/role'

import { baxUserLogin, kaNavigation } from 'api/ka'

const MENU_GROUP_MAP = {
  'charge': ['qwt-charge', 'seo-charge'],
  'seo': ['seo-create-promotion', 'seo-promotion-list'],
  'sst': ['qwt-create-promotion', 'qwt-promotion-list'],
  'bw': ['bw-query-price', 'bw-plan-list'],
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
  created() {
    this.initNavMenu()
  },
  data() {
    return {
      version,
      defaultActive: null,
      defaultOpeneds: [],
      isRenderSiteLink: false,
      isRenderSiteNavTag: false,

      isKaSuperman: false
    }
  },
  watch: {
    $route(route) {
      this.defaultOpeneds = Object
        .entries(MENU_GROUP_MAP)
        .reduce((defaultOpeneds, [group_index, group]) => {
          if(group.some(item => item === route.name)) {
            return defaultOpeneds.concat(group_index)
          }
          return defaultOpeneds
        }, [])
      this.defaultActive = route.name
    }
  },
  computed: {
    allowNotSeeBwNewPrice() {
      // 外部代理商无法看到标王新建页面
      return allowNotSeeBwNewPrice(this.userInfo.roles, this.userInfo.agentId)
    },
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
  mounted() {
    this.initNavMenu()
  },
  methods: {
    goKaSuperPage() {
      location.href = '/ka/vendor/site'
    },
    async initNavMenu() {
      // 获取ka nav 数据
      this.isKaSuperman = ((await baxUserLogin()).data.roles || []).includes('seo_vendor')
      const { offlineSiteNum, canUseTicketsNum, allTicketsNum } = await kaNavigation()
      this.isRenderSiteNavTag = !!(offlineSiteNum || canUseTicketsNum)
      this.isRenderSiteLink = !!allTicketsNum
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
  }
}
</script>

<style lang="postcss" scoped>
@import '../../cssbase/var';
:root {
  --active-bg: #FFF7EB;
}

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
  top: 50px;
  left: 0;
  bottom: 0;
  z-index: 1;
  display: flex;
  flex-flow: column;
  background: #fff;
  min-width: 180px;
  width: 180px;
  border-right: 1px solid #e6e6e6;
  & > main {
    margin-top: 12px;
  }
}

.sidebar {
  & >>> .el-menu-item {
    height: 48px;
    line-height: 48px;
    min-width: unset;
    padding-right: 0;
    &:hover {
      background-color: var(--active-bg) !important;
    }
    &.is-active {
      background-color: var(--active-bg) !important;
    }
  }
  & >>> .el-submenu__title {
    height: 48px;
    line-height: 48px;
    &:hover {
      background-color: var(--active-bg) !important;
    }
  }
  & >>> .el-icon-news, & >>> .el-icon-document {
    text-align: left;
    margin-right: 1px;
    font-size: 16px;
  }
  & .el-icon-question {
    margin-top: -2px;
    margin-left: -3px;
    color: rgb(255, 99, 80);
    font-size: 16px;
  }
}
</style>
