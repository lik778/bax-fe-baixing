
<template>
  <div class="account-container">
    <main>
      <h1>{{ userInfo.name }}，欢迎回来</h1>
      <account-summary />
      <consume />
      <charge />
      <log-list :all-areas="allAreas"/>
    </main>
  </div>
</template>

<script>
import AccountSummary from './summary'
import Consume from './consume'
import Charge from './charge'
import LogList from './log-list'

import track from 'util/track'

export default {
  name: 'bax-account',
  components: {
    AccountSummary,
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
  & > main {
    background-color: #fff;
    padding: 20px;
    border-radius: 4px;
  }
}
</style>
