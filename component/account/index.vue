
<template>
  <div class="account-container">
    <topbar :userInfo="userInfo">
      <label slot="title">账户</label>
    </topbar>
    <h1>{{ userInfo.name }},欢迎回来</h1>
    <account-summary></account-summary>
    <log :all-areas="allAreas"></log>
  </div>
</template>

<script>
import AccountSummary from './summary'
import Topbar from 'com/topbar'
import Log from './log'

export default {
  name: 'bax-account',
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
  components: {
    AccountSummary,
    Topbar,
    Log
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
