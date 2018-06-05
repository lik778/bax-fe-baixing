
<template>
  <div class="material-info">
    <topbar :userInfo="userInfo">
      <label slot="title">物料详情</label>
    </topbar>
    <main>
      <section>
        <a v-bind:href="material.imgUrl" target="_blank">
          <img class="img" v-bind:src="material.imgUrl" />
        </a>
      </section>
      <section>
        <item label="名称" :value="material.name" />
        <item label="类型" :value="getMType(material.materialType)" />
        <item label="规格" :value="material.slot" />
        <item label="内容" :value="material.content" />
        <item tag="a" label="链接" :value="material.link" />
      </section>
    </main>
  </div>
</template>

<script>
import Topbar from 'com/topbar'
import Item from './item'

import store from './store'

import {
  materialType
} from 'constant/material'

export default {
  name: 'material-info',
  fromMobx: {
    material: () => store.material
  },
  components: {
    Topbar,
    Item
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  methods: {
    getMType(s) {
      return materialType[String(s)]
    }
  },
  async mounted() {
    const id = this.$route.params.id
    await store.getMaterial(id)
  }
}
</script>

<style scoped>
.img {
  max-width: 400px;
  max-height: 400px;
  object-fit: contain;
  cursor: pointer;
}

.material-info {
  padding: 0 35px;
  width: 100%;
}
</style>
