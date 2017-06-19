
<template>
  <div class="gw-custom-page">
    <topbar :user-info="userInfo">
      <label slot="title">单页定值</label>
    </topbar>
    <main>
      <h2>~ 敬请期待哟 ~</h2>
    </main>
  </div>
</template>

<script>

import Topbar from 'com/topbar'

export default {
  name: 'order-info',
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

.gw-custom-page {
  padding: 0 35px;
  width: 100%;
}

</style>
