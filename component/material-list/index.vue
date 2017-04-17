
<template>
  <div>
    <topbar :userInfo="userInfo">
      <label slot="title">物料管理</label>
    </topbar>
    <material-filter />
    <material-list :materials="materials"
      :total="total" :limit="limit"
      :offset="offset" />
  </div>
</template>

<script>

import MaterialFilter from './filter'
import MaterialList from './list'
import Topbar from 'com/topbar'

import store from './store'

import {
  getMaterials
} from './action'

export default {
  name: 'material',
  store,
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
  },
  async mounted() {
    await getMaterials()
  }
}

</script>

<style scoped>

div {
  padding: 0 35px;
}

</style>
