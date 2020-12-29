
<template>
  <i class="el-icon-document"
    v-clipboard:copy="content"
    v-clipboard:success="onCopySuccess"
    v-clipboard:error="onCopyError"
    title="复制"
  />
</template>

<script>
import { Message } from 'element-ui'

export default {
  name: 'bax-clipboard',
  props: {
    content: {
      type: [String, Number],
      required: true
    }
  },
  methods: {
    onCopySuccess () {
      Message.success('已复制到剪切板')
      this.$emit('success')
    },
    onCopyError () {
      Message.error('复制到剪切板失败')
    }
  }
}
</script>

<style lang="scss" scoped>
i {
  margin-left: 5px;
  font-size: 20px;
  cursor: pointer;
}
</style>
