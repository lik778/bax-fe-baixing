
<template>
  <div class="container" v-loading.fullscreen="fullscreenLoading">
    <el-dialog
      width="578px"
      :visible.sync="showNotice"
      @close="handleNotificationClose"
    >
      <h3 slot="title">通知</h3>
      <div class="notification">
        <p>亲爱的用户，为了提供更稳定的系统服务，我们将在如下时间进行系统维护，在此期间可能对您的部分操作发生影响，但不影响广告投放和精品官网正常展示。感谢您的谅解。</p>
        <ul>
          <li>
            影响时间
            <p>1）2020-02-25  22:30 – 2020-02-25 23:00</p>
            <p>2）2020-02-27  23:00 – 2020-02-28 02:00</p>
          </li>
          <li>
            影响内容
            <p>1）可能发生无法登录搜索通bax系统、精品官网系统的情况</p>
            <p>2）可能发生站外推广计划、标王计划、首页宝计划、精品官网，不可进行新建、编辑、修改等操作</p>
            <p>3）可能发生不可购买站外推广、标王、首页宝、精品官网的情况</p>
          </li>
        </ul>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="showNotice = false">确认</el-button>
      </div>
    </el-dialog>
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
    <!-- <huo-dong-btn /> -->
    <back-to-top />
    <wechat-scan />
    <chat />
    <bw-shopping-cart ref="bwShoppingCart" :userInfo="currentUser" v-if="currentUser.id && isBwRoute" :salesInfo="salesInfo" :allAreas="allAreas"/>
  </div>
</template>

<script>
// import HuoDongIntro from './common/huodong-intro'
// import HuoDongBtn from './common/huodong-btn'
import NewUserIntro from './common/new-user-intro'
import AddUserLead from './common/add-user-lead'
import WechatScan from './widget/wechat-scan'
import BackToTop from './widget/back-to-top'
import Sidebar from './layout/sidebar'
import Header from './layout/header'
import Chat from './widget/chat'
import BwShoppingCart from './common/bw-shopping-cart'

import gStore from './store'

import es from 'base/es'

import track from 'util/track'
import {
  normalizeRoles
} from 'util/role'

import {router} from '../template/bax'
import qs from 'query-string'

const LAST_NOTIFICATION_KEY = 'LAST_NOTIFICATION'
const NOTICE_TIMES_KEY = 'NOTICE_TIMES'
const ONE_DAY_DURATION_MS = 86400000
const MAX_NOTICE_TIMES = 3
const getLocalstoreNumberData = function(key) {
  return Number(window.localStorage.getItem(key) || 0)
}

export default {
  name: 'bax',
  components: {
    BwShoppingCart,
    // HuoDongIntro,
    // HuoDongBtn,
    NewUserIntro,
    AddUserLead,
    WechatScan,
    BackToTop,
    Sidebar,
    Header,
    Chat
  },
  fromMobx: {
    addUserLeadVisible: () => gStore.addUserLeadVisible,
    currentUser: () => gStore.currentUser,

    allCategories: () => gStore.allCategories,
    allAreas: () => gStore.allAreas,
    allRoles: () => gStore.allRoles
  },
  data() {
    return {
      showNewUserIntro: false,
      newUserIntroMode: '',
      pending: 0,
      showNotice: (Date.now() - getLocalstoreNumberData(LAST_NOTIFICATION_KEY) > ONE_DAY_DURATION_MS) ||
        getLocalstoreNumberData(NOTICE_TIMES_KEY) < MAX_NOTICE_TIMES,
      huoDongIntroVisible: !document.referrer.includes('/a/quanwangtong'),
      isBwRoute: false,
      salesInfo: {
        salesId: '',
        userId: ''
      },
    }
  },
  computed: {
    fullscreenLoading() {
      return this.pending > 0
    },
    topCategories() {
      return this.allCategories
        .filter(c => c.level === 1)
        .map(c => ({
          label: c.nameCn,
          id: c.id
        }))
    }
  },
  methods: {
    handleNotificationClose() {
      const lastNotification = getLocalstoreNumberData(LAST_NOTIFICATION_KEY)
      const noticeTimes = getLocalstoreNumberData(NOTICE_TIMES_KEY)

      if (lastNotification + ONE_DAY_DURATION_MS > Date.now()) {
        window.localStorage.setItem(NOTICE_TIMES_KEY, (noticeTimes + 1).toString())
      } else {
        window.localStorage.setItem(LAST_NOTIFICATION_KEY, (Date.now() + ONE_DAY_DURATION_MS).toString())
        window.localStorage.setItem(NOTICE_TIMES_KEY, '1')
      }

    },
    toggleAddUserLeadVisible() {
      gStore.toggleAddUserLeadVisible()
    }
  },
  async beforeMount() {
    // 全局只 mount 一次, 无需 remove listener
    es.addListener('http fetch start', () => {
      this.pending = this.pending + 1
    })

    es.addListener('http fetch end', () => {
      this.pending = this.pending - 1
    })

    console.log('in before mount, query', this.$route.query)
  },
  created() {
    // 记录销售的客户id等信息
    // 米奇跳转userId需改成user_id
    const {user_id, userId, sales_id: salesId} = qs.parse(location.search)
    const uid = userId || user_id
    if (uid && salesId) {
      this.salesInfo.userId = +uid
      this.salesInfo.salesId = +salesId
    }
  },
  async mounted() {
    await Promise.all([
      gStore.getCurrentUser(),
      gStore.getCategories(),
      gStore.getAreas(),
      gStore.getRoles()
    ])

    // 购物车限制在标王页面
    this.isBwRoute = this.$route.path.startsWith('/main/bw')
    router.beforeEach((to, from, next) => {
      this.isBwRoute = to.path.startsWith('/main/bw')
      next()
    })

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

<style scoped lang="postcss">
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
  .notification {
    font-size: 15px;
    & > ul {
      padding: 20px;
    }
    & li {
      list-style: disc;
      margin-bottom: 10px;
      & p {
        line-height: 1.6;
        font-size: 14px;
        text-indent: 1.5em;
      }
    }
  }
  .main-content {
    width: 100%;
    padding-top: 50px;
    padding-left: 180px;
    background-color: #eeeff0;
  }
  .view {
    margin: 12px 12px 32px;
  }
</style>

<style lang="postcss">
@import 'cssbase/reset';
@import 'cssbase/mixin';

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
  background-color: transparent !important;
  height: 173px;
}
</style>
