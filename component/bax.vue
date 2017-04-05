
<template>
  <content>
    <sidebar></sidebar>
    <router-view></router-view>
  </content>
</template>

<script>

import Sidebar from './sidebar'

export default {
  name: 'bax',
  components: {
    Sidebar
  },
  data() {
    return {
    }
  }
}

</script>

<style>

@import 'cssbase/reset';

</style>

<style scoped>

content {
  display: flex;
  width: 100%;
  height: 100%;

  & > div:last-child {
    flex-grow: 1;
  }
}

</style>
