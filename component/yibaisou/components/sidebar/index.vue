
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
            <bx-icon type="sharealt"></bx-icon>标王2.0
          </template>
          <el-menu-item index="bw-plus-query-price" v-if="!userInfo.shAgent && relationAllow()">
            <router-link :to="{ name: 'bw-plus-query-price' }" tag="p">
              标王查价
            </router-link>
          </el-menu-item>
          <el-menu-item index="bw-plus-price-records" v-if="!userInfo.shAgent && relationAllow()">
            <router-link :to="{ name: 'bw-plus-price-records' }" tag="p">
              查价记录
            </router-link>
          </el-menu-item>
          <el-menu-item index="bw-plus-package-list">
            <router-link :to="{ name: 'bw-plus-package-list' }" tag="p">
              管理推广
            </router-link>
          </el-menu-item>
        </el-submenu>
        <el-menu-item v-if="allowSeeDiamondSite" index="diamond-site-homepage" key="diamond-site-homepage">
          <a v-if="isDiamondSiteJumpToMainSite" href="//shop.baixing.com/management/shop" style="color: inherit">
            <i class="el-icon-news" />钻石店铺
          </a>
          <router-link v-else :to="{ name: 'qwt-charge' }" tag="p">
            <i class="el-icon-news" />钻石店铺
          </router-link>
        </el-menu-item>
      </el-menu>
    </main>
  </div>
</template>

<script>
import { version } from '../../../../package.json'
import BxIcon from 'com/widget/icon'

import {
  allowSeeQwtPromotion
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
  relationAllow,
  allowSeeDiamondSite,
  isSales,
  onlyAgentAccounting,
  allowBwplusDashboard,
  allowCareFreeDashboard
} from 'util/role'

import { getUserSites } from 'api/diamond-site'
import { baxUserLogin, kaOnlineAndTickets } from 'api/ka'

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
  computed: {
    allowQueryMaterials () {
      return allowQueryMaterials(this.userInfo.roles)
    },
    allowQueryAdItems () {
      return allowQueryAdItems(this.userInfo.roles)
    },
    allowQueryOrders () {
      return allowQueryOrders(this.userInfo.roles)
    },
    allowQueryUsers () {
      return allowQueryUsers(this.userInfo.roles)
    },
    // allow see bx ad ...
    allowSeeAccount () {
      return allowSeeAccount(this.userInfo.roles)
    },
    allowSeeBxAd () {
      return allowSeeBxAd(this.userInfo.roles)
    },
    // allow see qwt ...
    allowSeeQwtPromotion () {
      return allowSeeQwtPromotion(this.userInfo.roles)
    },
    allowSeeDiamondSite () {
      return allowSeeDiamondSite(this.userInfo.roles)
    },
    allowSales () {
      return isSales(this.userInfo.roles)
    },
    onlyAgentAccounting () {
      return onlyAgentAccounting(this.userInfo.roles)
    },
    allowBwplusDashboard () {
      const { userInfo } = this
      return allowBwplusDashboard(userInfo)
    },
    allowCareFreeDashboard () {
      const { userInfo } = this
      return allowCareFreeDashboard(userInfo)
    }
  },
  async mounted () {
    await this.initKaNav()
  },
  methods: {
    goKaSuperPage () {
      location.href = '/ka/vendor/site'
    },
    async initKaNav () {
      this.isKaSuperman = ((await baxUserLogin()).data.roles || []).includes('seo_vendor')

      const { hasSitesAndTickets } = await kaOnlineAndTickets()
      this.isRenderSiteLink = hasSitesAndTickets
    },
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
