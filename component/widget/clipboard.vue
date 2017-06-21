
<template>
  <i class="el-icon-document"
    v-clipboard:copy="content"
    v-clipboard:success="onCopySuccess"
    v-clipboard:error="onCopyError" />
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
    onCopySuccess() {
      Message.success('已复制到剪切板')
    },
    onCopyError() {
      Message.error('复制到剪切板失败')
    }
  }
}

</script>

<style scoped>

i {
  cursor: pointer;
}

</style>

