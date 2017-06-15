
<template>
  <div class="qwt-dashboard">
    <topbar :user-info="userInfo">
      <label slot="title">全网通 - 数据报表</label>
    </topbar>
  </div>
</template>

<script>

import Topbar from 'com/topbar'

export default {
  name: 'qwt-dashboard',
  components: {
    Topbar
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  }
}

</script>

<style scoped>

.qwt-dashboard {
  padding: 0 35px;
  width: 100%;
}

</style>
