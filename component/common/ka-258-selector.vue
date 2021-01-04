<template>
  <div class="selector">
    <p class="text">请输入页面：{{kaHost}}</p>
    <el-input :disabled="disabled" class="input" size="small" :value="path" @input="v => $emit('change', kaHost + v)" placeholder="请输入URL后半部分" />
  </div>
</template>

<script>
const kaHost = 'http://258.baixing.com/'

export default {
  name: 'ka-258-selector',
  props: {
    value: String,
    disabled: Boolean
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

<style lang="scss" scoped>
.selector {
  display: flex;
  align-items: center;
  & > .text {
    min-width: 250px;
  }
  & > .input {
    width: 200px;
  }
}
</style>
