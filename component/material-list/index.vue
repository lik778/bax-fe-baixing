
<template>
  <div>
    <topbar :userInfo="userInfo">
      <label slot="title">物料管理</label>
    </topbar>
    <material-filter></material-filter>
    <material-list></material-list>
  </div>
</template>

<script>

import MaterialFilter from './filter'
import MaterialList from './list'
import Topbar from 'com/topbar'

export default {
  name: 'material',
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  components: {
    MaterialFilter,
    MaterialList,
    Topbar
  }
}

</script>

<style scoped>

div {
  padding: 0 35px;
}

</style>
