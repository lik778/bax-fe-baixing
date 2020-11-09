<template>
  <span class="statics"><template v-if="!loading">{{value}}</template><i v-else class="el-icon-loading" /></span>
</template>
<script>
export default {
  props: {
    value: [String, Number],
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>
