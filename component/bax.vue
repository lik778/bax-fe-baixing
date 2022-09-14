
<template>
  <div class="container" v-loading.fullscreen="fullscreenLoading">
    <p v-if="flag" class="tip-p">配合百度正进行相关系统更新升级中，部分功能使用可能会受到影响，给您带来不便敬请谅解</p>
    <div v-else>
      <Header :userInfo="currentUser"/>
    <div class="main-content">
      <router-view class="view"
        :key="$route.fullPath"
        :userInfo="currentUser"
        :salesInfo="salesInfo"
        :allCategories="allCategories"
        :allAreas="allAreas"
        :allRoles="allRoles">
      </router-view>
    </div>
    <sidebar :user-info="currentUser"></sidebar>
    <new-user-intro
      :mode="newUserIntroMode"
      :visible="showNewUserIntro"
      @close="showNewUserIntro = false"
    />
    <add-user-lead
      :user-info="currentUser"
      :visible="addUserLeadVisible"
      @close="toggleAddUserLeadVisible"
    />
    <!-- <huo-dong-intro :show="huoDongIntroVisible" @close="huoDongIntroVisible = false" /> -->
    <huo-dong-btn v-if="inActivityPeriod" />
    <div class="right-utils">
    <chat />
    <back-to-top />
    <!-- <WechatQrcode/> -->
    <!-- <wechat-scan /> -->
    <Notification />
    </div>
    </div>
    <!-- <bw-shopping-cart ref="bwShoppingCart" :userInfo="currentUser" v-if="currentUser.id && isBwRoute" :salesInfo="salesInfo" :allAreas="allAreas"/> -->
  </div>
</template>

<script>
import NewUserIntro from './common/new-user-intro'
import Notification from './common/notification'
import AddUserLead from './common/add-user-lead'
// import WechatQrcode from './widget/wechat-qrcode.vue'
// import WechatScan from './widget/wechat-scan'
// import BwShoppingCart from './common/bw-shopping-cart.vue'
import BackToTop from './widget/back-to-top'
import Sidebar from './layout/sidebar'
import Header from './layout/header'
import Chat from './widget/chat'
import HuoDongBtn from './common/huodong-btn'
import { getWordAuthority } from 'api/fengming'

import gStore from './store'
import aStore from './activity-store'

import es from 'base/es'

import track from 'util/track'
import {
  normalizeRoles,
  isSales,
  isNormalUser,
  isYibaisouSales
} from 'util/role'
import { delCookie } from 'util/cookie'

import qs from 'query-string'
// import { router } from '../template/bax'

export default {
  name: 'bax',
  components: {
    NewUserIntro,
    Notification,
    AddUserLead,
    // WechatQrcode,
    // BwShoppingCart,
    // WechatScan,
    BackToTop,
    Sidebar,
    Header,
    Chat,
    HuoDongBtn
  },
  fromMobx: {
    addUserLeadVisible: () => gStore.addUserLeadVisible,
    currentUser: () => gStore.currentUser,
    inActivityPeriod: () => aStore.inActivityPeriod,
    allCategories: () => gStore.allCategories,
    allAreas: () => gStore.allAreas,
    allRoles: () => gStore.allRoles
  },
  data () {
    return {
      showNewUserIntro: false,
      // isBwRoute: false,
      newUserIntroMode: '',
      pending: 0,
      huoDongIntroVisible: !document.referrer.includes('/a/quanwangtong'),
      salesInfo: {
        salesId: '',
        userId: ''
      },
      flag: true
    }
  },
  computed: {
    fullscreenLoading () {
      return this.pending > 0
    },
    topCategories () {
      return this.allCategories
        .filter(c => c.level === 1)
        .map(c => ({
          label: c.nameCn,
          id: c.id
        }))
    }
  },
  methods: {
    toggleAddUserLeadVisible () {
      gStore.toggleAddUserLeadVisible()
    }
  },
  async beforeMount () {
    // 设置活动优惠信息
    await aStore.setDiscountInfoHTMLFactory()

    // 全局只 mount 一次, 无需 remove listener
    es.addListener('http fetch start', () => {
      this.pending = this.pending + 1
    })

    es.addListener('http fetch end', () => {
      this.pending = this.pending - 1
    })
  },
  async created () {
    // 记录销售的客户id等信息
    // 米奇跳转userId需改成user_id
    // eslint-disable-next-line
    const { user_id, user_id: userId, sales_id: salesId } = qs.parse(location.search)
    // eslint-disable-next-line
    const uid = userId || user_id
    if (uid && salesId) {
      this.salesInfo.userId = +uid
      this.salesInfo.salesId = +salesId
    }
    await getWordAuthority({ userId })
  },
  async mounted () {
    // source为当前用户是否是以优化师角色进入bax
    await Promise.all([
      gStore.getCurrentUser(),
      gStore.getCategories(),
      gStore.getAreas(),
      gStore.getRoles()
    ])
    const { source } = qs.parse(location.search)
    const { userId } = this.salesInfo
    const { roles, isYibaisouUser } = this.currentUser
    if (isNormalUser(roles)) {
      if (isYibaisouUser) {
        window.location.href = `${window.origin}/yibaisou`
        return
      }
    } else {
      if (isYibaisouSales(roles)) {
        window.location.href = `${window.origin}/yibaisou`
        return
      }
    }
    if (isSales(roles) && userId) {
      gStore.getRelation({ userId })
    }
    if (source) {
      document.cookie = 'source=' + source + ';path=/;'
      // 此接口为查询当前用户的角色（主管/优化师）以及和目标用户的关系，后端暂存，用作后面的校验
      await gStore.getFengmingOptimizer({ userId })
    } else {
      delCookie('source')
    }

    // 购物车限制在标王页面
    // this.isBwRoute = this.$route.path.startsWith('/main/bw/')
    // router.beforeEach((to, from, next) => {
    //   this.isBwRoute = to.path.startsWith('/main/bw/')
    //   next()
    // })

    setTimeout(() => {
      const { currentUser } = this
      // move to user intro component
      const roles = normalizeRoles(currentUser.roles)
      if (this.currentUser.isNewUser === 1 &&
        roles.includes('BAIXING_USER')) {
        this.showNewUserIntro = true
      } else if (Date.now() < 1529596800000) {
        const times = localStorage.getItem('bx-qt-sm-al-t') | 0
        if (times === 0) {
          // 初次
          this.newUserIntroMode = 'shenma'
          this.showNewUserIntro = true
          localStorage.setItem('bx-qt-sm-al-lt', Date.now())
          localStorage.setItem('bx-qt-sm-al-t', 1)
        } else if (times < 3) {
          const lastTime = parseInt(localStorage.getItem('bx-qt-sm-al-lt'))
          if ((Date.now() - lastTime) > 24 * 60 * 60 * 1000) {
            this.newUserIntroMode = 'shenma'
            this.showNewUserIntro = true
            localStorage.setItem('bx-qt-sm-al-lt', Date.now())
            localStorage.setItem('bx-qt-sm-al-t', times + 1)
          }
        }
      }

      track({
        action: 'bax: enter page',
        baixingId: currentUser.baixingId,
        baxId: currentUser.id,
        src: this.$route.query.src || ''
      })
    }, 1200)
  }
}
</script>

<style lang="scss" scoped>
  .tip-p {
    margin-top: 20px;
    text-align: center;
    font-size: 20px;
  }
  .notice {
    display: flex;
    position: fixed;
    left: 190px;
    top: 0;
    width: 35%;
    color: #f44336;
    background-color: white;
    font-size: .8em;
    z-index: 1000;
    box-shadow: 1px 2px 1px #ddd;

    & > .close {
      color: gray;
      font-size: 1.5em;
      cursor: pointer;
    }
  }
  .main-content {
    width: 100%;
    min-width: 1366px;
    padding-top: 50px;
    padding-left: 180px;
    background-color: #eeeff0;
    overflow-x: hidden;
    scroll-behavior: smooth;
    position: absolute;
    height: 100%;
  }
  .view {
    min-height: calc(100vh - 50px);
    box-sizing: border-box;
    padding: 12px 12px 32px;
  }
</style>

<style lang="scss">
* {
  font-family: PingFangSC-Regular, 'Open Sans', 'Microsoft YaHei', 微软雅黑, STHeiti, 'WenQuanYi Micro Hei', SimSun, sans-serif;
  -webkit-tap-highlight-color: transparent;
  vertical-align: baseline;
  box-sizing: border-box;
  font-size: 100%;
  outline: 0;
  padding: 0;
  margin: 0;
  border: 0;
}

html {
  font-family: 'Hiragino Sans GB', helvetica, tahoma, arial, sans-serif;
}

html, body {
  height: 100%;
}

a {
  background-color: transparent;
  text-decoration: none;
}

i {
  font-style: normal;
}

ul, li {
  list-style: none;
}

a, span, aside, label, strong {
  display: inline-block;
}

textarea {
  resize: none;
}

dialog {
  margin: auto;
}

body > .container {
  display: block;
  min-width: 1320px;
}

.el-tooltip__popper {
  max-width: 340px;
}

.el-input__prefix, .el-input__suffix {
  & > span {
    display: unset;
  }
}

.el-loading-mask {
  height: 100%;
}
.right-utils{
    position: fixed;
    right: 20px;
    bottom: 160px;
    z-index: 3;
}
</style>
