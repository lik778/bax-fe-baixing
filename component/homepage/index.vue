<template>
  <div class="qwt-homepage">
    <topbar :userInfo="userInfo">
      <label slot="title">首页</label>
    </topbar>
    <main>
      <span>
        <account :summary="summary" :coupons="coupons" />
        <campaign :summary="summary" />
      </span>
      <span>
        <board />
        <notification />
        <qa />
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
  props: ['userInfo'],
  fromMobx: {
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
          store.getCoupons({ onlyValid: true, status: 0 })
        ])
      }
    }
  },
  async mounted() {
    if (this.allowSeeAccount) {
      await Promise.all([
        store.getHomepageSummary(),
        store.getCoupons({ onlyValid: true, status: 0 })
      ])
    }
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
