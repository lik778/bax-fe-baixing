
<template>
  <el-dialog :visible="visible" size="small" :title="title" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <create v-if="false" :categories="categories" @cancel="toggleTuoguanVisible"/>
    <edit v-else @cancel="toggleTuoguanVisible"/>
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
  computed: {
    title() {
      return status.active ? '开启托管服务' : '托管服务'
    }
  },
  methods: {
    toggleTuoguanVisible
  },

  mounted() {
    getTuoguanStatus()
  }
}
</script>

<style>

</style>
