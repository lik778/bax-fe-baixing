
<template>
  <el-dialog :visible="visible" size="small" :title="title" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" :modal-append-to-body="true">
    <div v-if="loading">
      加载中...
    </div>
    <div v-else>
      <create v-if="!status.active" :categories="categories" @cancel="toggleTuoguanVisible"/>
      <edit v-else @cancel="toggleTuoguanVisible" :expire="status.expireAt"/>
    </div>
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
      loading: true
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
