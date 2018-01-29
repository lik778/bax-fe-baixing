
<template>
  <content v-loading.fullscreen="fullscreenLoading">
    <sidebar :user-info="currentUser"></sidebar>
    <router-view :userInfo="currentUser"
      :allCategories="allCategories"
      :allAreas="allAreas"
      :allRoles="allRoles">
    </router-view>
    <new-user-intro :visible="showNewUserIntro"
      @close="showNewUserIntro = false" />
    <add-user-lead :visible="addUserLeadVisible"
      @close="toggleAddUserLeadVisible"
      :user-info="currentUser" />
    <go-to-bottom></go-to-bottom>
    <back-to-top></back-to-top>
    <tuoguan :visible="tuoguanVisible"
      :categories="topCategories"
      :userInfo="currentUser" />
  </content>
</template>

<script>
import NewUserIntro from './common/new-user-intro'
import AddUserLead from './common/add-user-lead'
import GoToBottom from './widget/go-to-bottom'
import BackToTop from './widget/back-to-top'
import Sidebar from './sidebar'
import Tuoguan from './tuoguan'

import store from './store'

import es from 'base/es'

import {
  toggleAddUserLeadVisible,
  getCurrentUser,
  getCategories,
  getAreas,
  getRoles
} from './action'

export default {
  name: 'bax',
  store,
  components: {
    NewUserIntro,
    AddUserLead,
    GoToBottom,
    BackToTop,
    Sidebar,
    Tuoguan
  },
  data() {
    return {
      showNewUserIntro: false,
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
    toggleAddUserLeadVisible
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
      getCurrentUser(),
      getCategories(),
      getAreas(),
      getRoles()
    ])
  }
}
</script>

<style scoped>
content {
  display: flex;
  width: 100%;
  height: 100%;

  & > div:last-child {
    flex-grow: 1;
  }
}
</style>

<style>
@import 'cssbase/reset';
@import 'cssbase/mixin';

@mixin scrollbar;

body > content {
  width: 100%;
  min-width: 1200px;
  max-width: 1500px;
}

.el-tooltip__popper {
  max-width: 340px;
}

.el-loading-mask {
  background-color: unset;
  z-index: unset;
  top: 240px;
  bottom: unset;
  height: 100px;
}
</style>
