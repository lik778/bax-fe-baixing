
<template>
  <el-dialog :visible="visible" size="small" :title="title" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" v-loading="loading">
    <create v-if="!status.active" :categories="categories" @cancel="toggleTuoguanVisible"/>
    <edit v-else @cancel="toggleTuoguanVisible" :expire="status.expireAt"/>
  </el-dialog>
</template>

<script>
import {
  toggleTuoguanVisible
} from '../action'

import {
  getTuoguanStatus
} from './action'

import store from './store'

import Create from './Create'
import Edit from './Edit'

export default {
  props: {
    visible: Boolean,
    categories: Array
  },
  components: {
    Create,
    Edit
  },
  store,
  data() {
    return {
      loading: false
    }
  },
  computed: {
    title() {
      return this.status.active ? '开启托管服务' : '托管服务'
    }
  },
  methods: {
    toggleTuoguanVisible,
    async load() {
      this.loading = true
      await getTuoguanStatus()
      this.loading = false
    }
  },

  mounted() {
    this.load()
  },

  watch: {
    visible(v) {
      if (v) {
        this.load()
      }
    }
  }
}
</script>

<style>

</style>
