
<template>
  <div class="sidebar">
    <main>
      <el-menu
        style="border: none;"
        :default-active="defaultActive"
        :unique-opened="true"
        background-color="#fff"
        active-text-color="#FF6350"
        text-color="#333"
        ref="menu"
      >
        <el-submenu index="fengMingRoutes" key="fengMingRoutes">
          <template slot="title">
            <bx-icon type="sharealt"></bx-icon>百搜凤鸣
          </template>
          <el-menu-item  index="fengming-main">
            <router-link :to="{ name: 'fengming-main' }" tag="p">
              账户概览
            </router-link>
          </el-menu-item>
          <!-- v-if="allowSeeQwtCharge" -->
          <el-menu-item  v-if="allowSeeQwtCharge"   index="qwt-charge">
            <router-link  :to="{ name: 'qwt-charge' }" tag="p">
              充值资金
            </router-link>
          </el-menu-item>
          <el-menu-item  index="qwt-create-promotion">
            <router-link :to="{ name: 'qwt-create-promotion' }" tag="p">
              新建推广
            </router-link>
          </el-menu-item>
          <el-menu-item index="qwt-promotion-list">
            <router-link :to="{ name: 'qwt-promotion-list' }" tag="p">
              管理推广
            </router-link>
          </el-menu-item>
          <el-menu-item index="qwt-dashboard">
            <router-link :to="{ name: 'qwt-dashboard' }" tag="p">
              数据报表
            </router-link>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="diamondShop" key="diamondShop">
          <a  :href="locationShop" style="color: inherit">
            <i class="el-icon-news" />钻石店铺
          </a>
        </el-menu-item>
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
import { baxUserLogin, kaOnlineAndTickets } from 'api/ka'

// const MENU_GROUP_MAP = {
//   fengMingRoutes: ['fengming-main', 'qwt-charge', 'qwt-create-promotion', 'qwt-promotion-list', 'qwt-dashboard']
// }

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
      // defaultOpeneds: [],
      isRenderSiteLink: false,
      isRenderSiteNavTag: false,
      relationAllow,
      isDiamondSiteJumpToMainSite: false,
      isKaSuperman: false
    }
  },
  computed: {
    // 只有易白搜的销售才可以看到充值资金
    allowSeeQwtCharge () {
      const { roles } = this.userInfo
      const currentRoles = normalizeRoles(roles)
      return checkRoles(currentRoles, ['YBS_SALES'])
    },
    locationShop () {
      return `//baixing.com/oz/login/?redirect=${encodeURIComponent('//shop.baixing.com/management/shop')}`
    }
    // allowSeeQueryPrice () {
    //   const { roles } = this.userInfo
    //   const currentRoles = normalizeRoles(roles)
    //   return checkRoles(currentRoles, ['YBS_SALES'])
    // },
    // allowSeeRecord () {
    //   const { roles } = this.userInfo
    //   const currentRoles = normalizeRoles(roles)
    //   return checkRoles(currentRoles, ['YBS_ACCOUNTING', 'YBS_SALES'])
    // },
    // allowSeeManage () {
    //   const { isYibaisouUser } = this.userInfo
    //   const { roles } = this.userInfo
    //   const currentRoles = normalizeRoles(roles)
    //   return (isYibaisouUser || checkRoles(currentRoles, ['YBS_SALES']))
    // },
    // allowSeeDianpu () {
    //   const { isYibaisouUser } = this.userInfo
    //   return isYibaisouUser
    // }
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      handler (route) {
        // this.defaultOpeneds = Object
        //   .entries(MENU_GROUP_MAP)
        //   .reduce((defaultOpeneds, [groupIndex, group]) => {
        //     if (group.some(item => item === route.name)) {
        //       return defaultOpeneds.concat(groupIndex)
        //     }
        //     return defaultOpeneds
        //   }, [])
        this.defaultActive = route.name
      }
    },
    'userInfo.roles' () {
      // TIP: 只有普通销售会去
      if (allowSeeDiamondSite(this.userInfo.roles)) {
        this.initDiamondSiteNav()
      }
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
