
<template>
  <div class="account-container">
    <main>
      <h1 class="title">{{ userInfo.name }}，欢迎回来</h1>
      <account-summary :userInfo="userInfo"/>
      <consume />
      <charge />
      <log-list :all-areas="allAreas"/>
      <order-list />
    </main>
  </div>
</template>

<script>
import AccountSummary from './summary'
import Consume from './consume'
import Charge from './charge'
import LogList from './log-list'
import orderList from './order-list'

import track from 'util/track'

export default {
  name: 'bax-account',
  components: {
    AccountSummary,
    orderList,
    LogList,
    Consume,
    Charge
  },
  props: {
    allAreas: {
      type: Array,
      required: true
    },
    userInfo: {
      type: Object,
      required: true
    }
  },
  mounted() {
    const { userInfo } = this
    track({
      action: 'account: enter page',
      baixingId: userInfo.baixingId,
      baxId: userInfo.id
    })
  }
}
</script>

<style lang="postcss" scoped>
.account-container {
  padding: 0 35px;
  width: 100%;
  color: #6a778c;
  & .title {
    background-color: #fff;
    padding: 20px 20px 6px;
    border-radius: 4px;
  }
  & >>> .layout-container {
    background-color: #fff;
    border-radius: 4px;
    padding: 20px;
    box-shadow: 0 2px 9px 0 rgba(83, 95, 127, .10);
    margin-bottom: 10px;
  }
}
</style>
