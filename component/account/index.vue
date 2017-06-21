<template>
  <div class="account-container">
    <h1>{{userInfo.name}},欢迎回来</h1>
    <Summary />
    <Log />
  </div>
</template>

<script>
  import Summary from './summary'
  import Log from './log'
  export default {
    name: 'account',
    props: ['userInfo'],
    components: {
      Summary,
      Log
    }
  }
</script>

<style scoped>
  .account-container {
    padding: 0 35px;
    width: 100%;
  }
</style>
