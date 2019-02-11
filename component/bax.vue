
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
    <el-dialog :visible.sync="dialogVisible" width="700px" title="通知" :center="true">
      <div class="user-notice">
        <p>
          春节临近，为确保投放的效果，搜索通【站外推广】及【标王】产品于1月31日起暂停百度投放，年后视流量恢复情况进行投放恢复。
        </p>
        <p>
          具体安排如下：
        </p>
        <p>
          1、【站外推广】所有百度计划暂停投放（360、神马、搜狗除外），期间不会产生任何消耗，预计2月7日恢复（具体视流量恢复情况而定）。
        </p>
        <p>
          2、【标王】暂停期间不扣时长，预计在2月11日恢复（具体视流量恢复情况而定）。如有疑问，可在年后联系您的专属销售核实。
        </p>
        <p>
          以上操作系统自动完成，您不用进行任何操作。祝您春节快乐，财源广进。
        </p>
      </div>
    </el-dialog>
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
      notice: '近期因360家电维修行业被整治，目前360渠道关于家电维修的订单会全部下线，请知晓',
      showNotice: true,
      huoDongIntroVisible: !document.referrer.includes('/a/quanwangtong'),
      isBwRoute: false,
      salesInfo: {
        salesId: '',
        userId: ''
      },
      dialogVisible: true
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

    // 记录销售的客户id等信息
    const {user_id: userId, sales_id: salesId} = this.$route.query
    if (userId && salesId) {
      this.salesInfo.userId = +userId
      this.salesInfo.salesId = +salesId
    }
  },
  created() {
    // 记录销售的客户id等信息
    // 米奇跳转userId需改成user_id
    const {user_id, userId, sales_id: salesId} = this.$route.query
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
  .main-content {
    width: 100%;
    padding-top: 50px;
    padding-left: 180px;
    background-color: #eeeff0;
  }
  .view {
    padding: 12px 12px 32px;
  }
  .user-notice {
    font-size: 16px;
    padding: 10px 0 30px;
    & > p {
      margin-bottom: 10px;
    }
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
