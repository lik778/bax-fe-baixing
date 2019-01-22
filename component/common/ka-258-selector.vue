<template>
  <div>
    请输入页面地址：{{kaHost}} <el-input :value="path" @input="v => $emit('change', kaHost + v)" />
  </div>
</template>

<script>
const kaHost = 'http://258.baixing.com/'

export default {
  name: 'ka-258-selector',
  props: {
    value: String
  },
  data() {
    return {
      kaHost
    }
  },
  computed: {
    path() {
      if (!this.value.includes(kaHost)) {
        return ''
      }
      return this.value.slice(kaHost.length)
    }
  },
}
</script>
