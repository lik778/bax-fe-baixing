
<template>
  <div class="page">
    <topbar :userInfo="userInfo">
      <label slot="title">物料管理</label>
    </topbar>
    <material-header :query="query" />
    <material-list
      :materials="materials"
      :query="query"
    />
  </div>
</template>

<script>
import MaterialHeader from './header'
import MaterialList from './list'
import Topbar from 'com/topbar'

import store from './store'

export default {
  name: 'material',
  components: {
    MaterialHeader,
    MaterialList,
    Topbar
  },
  fromMobx: {
    materials: () => store.materials,
    query: () => store.query
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  async mounted() {
    await store.getMaterials({
      ...this.query
    })
  }
}
</script>
