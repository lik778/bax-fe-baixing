<template>
  <div class="qwt-homepage">
    <topbar :userInfo="userInfo">
      <label slot="title">首页</label>
    </topbar>
    <main>
      <span>
        <account :user-info="userInfo" :summary="summary" :coupons="coupons" />
        <campaign type="qwt" :user-info="userInfo" :summary="summary" />
        <campaign type="mvp" :user-info="userInfo" :summary="mvpSummary" />
      </span>
      <span>
        <board />
        <notification />
        <qa :user-info="userInfo" />
      </span>
    </main>
  </div>
</template>

<script>
import Topbar from 'com/topbar'

import Notification from './notification'
import Campaign from './campaign'
import Account from './account'
import Board from './board'
import Qa from './qa'

import { allowSeeAccount } from 'util/role'
import track from 'util/track'

import store from './store'

export default {
  name: 'qwt-homepage',
  components: {
    Notification,
    Campaign,
    Account,
    Board,
    Qa,
    Topbar
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  fromMobx: {
    mvpSummary: () => store.mvpSummary,
    summary: () => store.summary,
    coupons: () => store.coupons
  },
  data() {
    return {
      load: false // 仅查询一次
    }
  },
  computed: {
    allowSeeAccount() {
      return allowSeeAccount(this.userInfo.roles)
    }
  },
  watch: {
    async userInfo(user) {
      if (this.allowSeeAccount) {
        if (this.load) return

        this.load = true

        await Promise.all([
          store.getHomepageSummary(),
          store.getMvpSummary(),
          store.getCoupons({ onlyValid: true, status: 0 })
        ])
      }
    }
  },
  async mounted() {
    const { userInfo } = this

    if (this.allowSeeAccount) {
      await Promise.all([
        store.getHomepageSummary(),
        store.getMvpSummary(),
        store.getCoupons({ onlyValid: true, status: 0 })
      ])
    }

    track({
      action: 'homepage: enter page',
      baixingId: userInfo.baixingId,
      baxId: userInfo.id
    })
  }
}
</script>

<style scoped>
@import '../../cssbase/var';

.qwt-homepage {
  display: flex;
  flex-flow: column;
  width: 100%;
  background: var(--qwt-c-gray);

  & > main {
    display: flex;
    min-width: 1125px;
    padding: 10px;

    & > span:last-child {
      margin-left: 10px;
    }
  }
}

</style>

<style>
@import '../../cssbase/var';

.qwt-homepage .card {
  padding: 0 20px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 9px 0 rgba(83, 95, 127, 0.1);

  & > header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 42px;
    border-bottom: 1px solid #e6e6e6;

    & > strong {
      font-weight: 600;
      color: #666666;
    }

    & > a {
      color: var(--qwt-c-blue);
      font-size: 14px;
    }
  }
}
</style>
