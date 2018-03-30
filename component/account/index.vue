
<template>
  <div class="account-container">
    <topbar :userInfo="userInfo">
      <label slot="title">账户</label>
    </topbar>
    <h1>{{ userInfo.name }}，欢迎回来</h1>
    <account-summary />
    <consume />
    <charge />
  </div>
</template>

<script>
import AccountSummary from './summary'
import Consume from './consume'
import Charge from './charge'

import Topbar from 'com/topbar'

import track from 'util/track'

export default {
  name: 'bax-account',
  components: {
    AccountSummary,
    Consume,
    Charge,
    Topbar
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

<style scoped>
.account-container {
  padding: 0 35px;
  width: 100%;
  color: #6a778c;
}
</style>
