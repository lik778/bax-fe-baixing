
<template>
  <content>
    <sidebar></sidebar>
    <main>{{ msg }}</main>
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
      msg: 'bingo'
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
}

</style>
