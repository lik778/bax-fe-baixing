
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
        <el-submenu index="bwPlus">
          <template slot="title">
            <bx-icon type="sharealt"></bx-icon>百搜标王
          </template>
          <el-menu-item v-if="allowSeeQueryPrice" index="bw-plus-query-price">
            <router-link :to="{ name: 'bw-plus-query-price' }" tag="p">
              百搜标王查价
            </router-link>
          </el-menu-item>
          <el-menu-item v-if="allowSeeRecord" index="bw-plus-price-records">
            <router-link :to="{ name: 'bw-plus-price-records' }" tag="p">
              查价记录
            </router-link>
          </el-menu-item>
          <el-menu-item v-if="allowSeeManage" index="bw-plus-package-list">
            <router-link :to="{ name: 'bw-plus-package-list' }" tag="p">
              管理推广
            </router-link>
          </el-menu-item>
        </el-submenu>
        <el-menu-item v-if="allowSeeDianpu" index="diamond-site-homepage" key="diamond-site-homepage">
          <a v-if="isDiamondSiteJumpToMainSite" href="//shop.baixing.com/management/shop" style="color: inherit">
            <i class="el-icon-news" />钻石店铺
          </a>
          <router-link v-else :to="{ name: 'qwt-charge' }" tag="p">
            <i class="el-icon-news" />钻石店铺
          </router-link>
        </el-menu-item>
        <el-submenu v-if="allowSeeDianpu" index="dashboard">
          <template slot="title">
            <i class="el-icon-document" />数据报表
          </template>
          <el-menu-item index="qwt-dashboard">
            <router-link :to="{ name: 'bw-plus-dashboard'}" tag="p">
              易百搜推广报表
            </router-link>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </main>
  </div>
</template>

<script>
import { version } from '../../../../package.json'
import BxIcon from 'com/widget/icon'

import {
  relationAllow,
  allowSeeDiamondSite,
  checkRoles,
  normalizeRoles
} from 'util/role'

import { getUserSites } from 'api/diamond-site'
// import { baxUserLogin, kaOnlineAndTickets } from 'api/ka'

const MENU_GROUP_MAP = {
  charge: ['qwt-charge', 'seo-charge'],
  sst: ['qwt-create-promotion', 'qwt-promotion-list'],
  bw: ['bw-plan-list'],
  bwPlus: ['bw-plus-query-price', 'bw-plus-price-records', 'bw-plus-package-list'],
  qc: ['qc-promote-list'],
  ssp: ['ad-list', 'material-list', 'order-list', 'user-list', 'ad-calendar'],
  dashboard: ['qwt-dashboard', 'bw-dashboard', 'qc-dashboard', 'bw-plus-dashboard', 'ad-dashboard']
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
  data () {
    return {
      version,
      defaultActive: null,
      defaultOpeneds: [],
      isRenderSiteLink: false,
      isRenderSiteNavTag: false,
      relationAllow,
      isDiamondSiteJumpToMainSite: false,
      isKaSuperman: false
    }
  },
  computed: {
    allowSeeQueryPrice () {
      const { roles } = this.userInfo
      const currentRoles = normalizeRoles(roles)
      return checkRoles(currentRoles, ['YBS_SALES'])
    },
    allowSeeRecord () {
      const { roles } = this.userInfo
      const currentRoles = normalizeRoles(roles)
      return checkRoles(currentRoles, ['YBS_ACCOUNTING', 'YBS_SALES'])
    },
    allowSeeManage () {
      const { isYibaisouUser } = this.userInfo
      const { roles } = this.userInfo
      const currentRoles = normalizeRoles(roles)
      return (isYibaisouUser || checkRoles(currentRoles, ['YBS_SALES']))
    },
    allowSeeDianpu () {
      const { isYibaisouUser } = this.userInfo
      return isYibaisouUser
    }
  },
  watch: {
    $route (route) {
      this.defaultOpeneds = Object
        .entries(MENU_GROUP_MAP)
        .reduce((defaultOpeneds, [groupIndex, group]) => {
          if (group.some(item => item === route.name)) {
            return defaultOpeneds.concat(groupIndex)
          }
          return defaultOpeneds
        }, [])
      this.defaultActive = route.name
    },
    'userInfo.roles' () {
      // TIP: 只有普通销售会去
      if (allowSeeDiamondSite(this.userInfo.roles)) {
        this.initDiamondSiteNav()
      }
    }
  },
  // async mounted () {
  //   await this.initKaNav()
  // },
  methods: {
    // goKaSuperPage () {
    //   location.href = '/ka/vendor/site'
    // },
    // async initKaNav () {
    //   this.isKaSuperman = ((await baxUserLogin()).data.roles || []).includes('seo_vendor')

    //   const { hasSitesAndTickets } = await kaOnlineAndTickets()
    //   this.isRenderSiteLink = hasSitesAndTickets
    // },
    async initDiamondSiteNav () {
      const hasDiamondSite = !!(await getUserSites())
      this.isDiamondSiteJumpToMainSite = hasDiamondSite
    }
  }
}
</script>

<style lang="scss" scoped>
$active-bg: #fff7eb;

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
  z-index: 1000;
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
  & /deep/ .el-menu-item {
    height: 48px;
    line-height: 48px;
    min-width: unset;
    padding-right: 0;
    &:hover {
      background-color: $active-bg !important;
    }
    &.is-active {
      background-color: $active-bg !important;
    }
  }
  & /deep/ .el-submenu__title {
    height: 48px;
    line-height: 48px;
    &:hover {
      background-color: $active-bg !important;
    }
  }
  & /deep/ .el-icon-news,
  & /deep/ .el-icon-document {
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

  ul.el-menu.el-menu--inline > .el-menu-item > * {
    padding-left: 8px;
  }
}
</style>
