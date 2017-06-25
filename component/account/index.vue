<template>
  <div class="account-container">
    <topbar :userInfo="userInfo">
      <label slot="title">账户</label>
    </topbar>
    <h1>{{userInfo.name}},欢迎回来</h1>
    <account-summary />
    <log />
  </div>
</template>

<script>
  import Topbar from 'com/topbar'
  import AccountSummary from './summary'
  import Log from './log'
  export default {
    name: 'account',
    props: ['userInfo'],
    components: {
      AccountSummary,
      Log,
      Topbar
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
