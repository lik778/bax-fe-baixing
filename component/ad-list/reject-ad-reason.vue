
<template>
  <el-dialog title="请填写拒绝理由" v-model="visible"
    :close-on-click-modal="false"
    @close="cancel">
    <el-form ref="form" label-width="100px">
      <el-form-item label="理由" required>
        <el-input v-model.trim="reason" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { Message } from 'element-ui'

export default {
  name: 'reject-ad-reason-dialog',
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      reason: ''
    }
  },
  methods: {
    empty() {
      this.reason = ''
      this.$emit('hide')
    },
    cancel() {
      this.empty()
    },
    async submit() {
      const {
        reason
      } = this

      if (!reason) {
        return Message.error('请填写理由')
      }

      this.$emit('success', reason)
      this.empty()
    }
  }
}

</script>

<style scoped>

.el-dialog__body {
  & > div {
    margin: 10px 0;
  }
}

</style>
