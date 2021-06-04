
<template>
  <main class="ccontainer">
    <header>{{ userInfo.name }}，欢迎回来</header>
    <account-summary :userInfo="userInfo"/>
    <consume />
    <charge />
    <log-list :all-areas="allAreas"/>
    <order-list />
  </main>
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
  mounted () {
    const { userInfo } = this
    track({
      action: 'account: enter page',
      baixingId: userInfo.baixingId,
      baxId: userInfo.id
    })
  }
}
</script>

<style lang="scss" scoped>
header {
  padding: 20px;
  padding-bottom: 0;
  color: #454647;
  font-size: 16px;
  font-weight: bold;
}
.layout-container {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 9px 0 rgba(83, 95, 127, .10);
  margin-top: 25px;
  margin-bottom: 10px;

  & /deep/ header {
    margin-top: 0;
    margin-bottom: 23px;
  }
}
</style>
