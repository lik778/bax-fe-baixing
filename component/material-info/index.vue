
<template>
  <div class="material-info">
    <topbar :userInfo="userInfo">
      <label slot="title">物料详情</label>
    </topbar>
    <main>
      <section>
        <img v-bind:src="material.imgUrl" />
      </section>
    </main>
  </div>
</template>

<script>

import Topbar from 'com/topbar'

import store from './store'

import {
  getMaterial
} from './action'

export default {
  name: 'material-info',
  store,
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  components: {
    Topbar
  },
  async mounted() {
    const id = this.$route.params.id
    await getMaterial(id)
  }
}

</script>

<style scoped>

.material-info {
  padding: 0 35px;
}

</style>
