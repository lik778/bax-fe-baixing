
<template>
  <div class="mvp-dashboard">
    <topbar :user-info="userInfo" :back="false">
    </topbar>
    <main>
      TODO ~
    </main>
  </div>
</template>

<script>
import Topbar from 'com/topbar'

export default {
  name: 'mvp-dashboard',
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

</style>
