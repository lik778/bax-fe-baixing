<template>
  <div class="operation-log">
    <topbar :userInfo="userInfo">
      <label slot="title">账户</label>
    </topbar>
    <h1>{{ userInfo.name }}，欢迎回来</h1>
    <log-list :all-areas="allAreas"></log-list>
  </div>
</template>

<script>
import Topbar from 'com/topbar'
import LogList from './list'

export default {
  name: 'qwt-operation-log',
  components: {
    LogList,
    Topbar
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    },
    allAreas: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.operation-log {
  padding: 0 35px;
  width: 100%;
  color: #6a778c;
}
</style>
