
<template>
  <div class="gw-charge">
    <topbar :user-info="userInfo">
      <label slot="title">精品官网 - 购买</label>
    </topbar>
  </div>
</template>

<script>

import Topbar from 'com/topbar'

export default {
  name: 'gw-charge',
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

.gw-charge {
  padding: 0 35px;
  width: 100%;
}

</style>
