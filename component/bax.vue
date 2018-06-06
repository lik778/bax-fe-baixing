
<template>
  <content v-loading.fullscreen="fullscreenLoading">
    <sidebar :user-info="currentUser"></sidebar>
    <p class="stuff"></p>
    <router-view class="view"
      :key="$route.fullPath"
      :userInfo="currentUser"
      :allCategories="allCategories"
      :allAreas="allAreas"
      :allRoles="allRoles">
    </router-view>
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
    <go-to-bottom />
    <back-to-top />
  </content>
</template>

<script>
import NewUserIntro from './common/new-user-intro'
import AddUserLead from './common/add-user-lead'
import GoToBottom from './widget/go-to-bottom'
import BackToTop from './widget/back-to-top'
import Sidebar from './sidebar'

import gStore from './store'

import es from 'base/es'

import track from 'util/track'
import {
  normalizeRoles
} from 'util/role'

export default {
  name: 'bax',
  components: {
    NewUserIntro,
    AddUserLead,
    GoToBottom,
    BackToTop,
    Sidebar
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
      pending: 0
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
  },
  async mounted() {
    await Promise.all([
      gStore.getCurrentUser(),
      gStore.getCategories(),
      gStore.getAreas(),
      gStore.getRoles()
    ])

    setTimeout(() => {
      const { currentUser } = this

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

<style scoped>
content {
  display: flex;
  width: 100%;
  height: 100%;

  & > p.stuff {
    height: 1px;
    width: 180px;
    min-width: 180px;
  }

  & > .view {
    max-width: calc(100% - 180px);
    width: calc(100% - 180px);
    flex-grow: 1;
  }
}
</style>

<style>
@import 'cssbase/reset';
@import 'cssbase/mixin';

body > content {
  width: 100%;
  min-width: 1320px;
  max-width: 1500px;
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
  background-color: unset;
  z-index: unset;
  top: 240px;
  bottom: unset;
  height: 100px;
}
</style>
