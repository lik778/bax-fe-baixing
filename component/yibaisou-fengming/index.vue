
<template>
  <div class="container" v-loading.fullscreen="fullscreenLoading">
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
    <!-- <new-user-intro
      :mode="newUserIntroMode"
      :visible="showNewUserIntro"
      @close="showNewUserIntro = false"
    /> -->
    <add-user-lead
      :user-info="currentUser"
      :visible="addUserLeadVisible"
      @close="toggleAddUserLeadVisible"
    />
    <huo-dong-btn v-if="inActivityPeriod" />
    <div class="right-utils">
    <chat />
    <back-to-top />
    <Notification />
    </div>
  </div>
</template>

<script>
// import NewUserIntro from '../common/new-user-intro'
import Notification from '../common/notification'
import AddUserLead from '../common/add-user-lead'
import BackToTop from '../widget/back-to-top'
import Sidebar from './components/sidebar'
import Header from './components/header'
import Chat from '../widget/chat'
import HuoDongBtn from '../common/huodong-btn'

import gStore from '../store'
import aStore from '../activity-store'

import track from 'util/track'
import {
  normalizeRoles,
  // isNormalUser,
  isYibaisouFengMing
} from 'util/role'
import { Message } from 'element-ui'
import { redirect } from 'util'
import qs from 'query-string'
// import { router } from '../template/bax'

export default {
  name: 'YibaisouFengming',
  components: {
    // NewUserIntro,
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
      }
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
  async created () {
    // 记录销售的客户id等信息
    // 米奇跳转userId需改成user_id
    // eslint-disable-next-line
    const { user_id, user_id: userId, sales_id: salesId } = qs.parse(location.search)
    console.log(qs.parse(location.search))
    // eslint-disable-next-line
    const uid = userId || user_id
    uid && (this.salesInfo.userId = +uid)
    salesId && (this.salesInfo.salesId = +salesId)
  },
  async mounted () {
    await Promise.all([
      gStore.getCurrentUser(),
      gStore.getCategories(),
      gStore.getAreas(),
      gStore.getRoles()
    ])
    const { roles } = this.currentUser
    if (!isYibaisouFengMing(roles)) {
      Message.error('您没有权限访问，请更换帐号登陆')
      return redirect('signin', `return=${encodeURIComponent(location.pathname + location.search)}`)
    }
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
