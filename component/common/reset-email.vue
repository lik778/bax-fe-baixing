
<template>
  <el-dialog title="请输入您的邮箱以便接收通知" :visible="visible"
    :close-on-click-modal="false" :show-close="false"
    :before-close="cancel">
    <el-form label-width="80px">
      <el-form-item label="邮箱" required>
        <el-input v-model="email" />
      </el-form-item>
      <section class="tip">
        必须填写有效的邮箱，避免操作失败
      </section>
    </el-form>
    <footer slot="footer">
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>

import { updateUserInfo } from 'api/account'
import { getCurrentUser } from '../action'

import { Message } from 'element-ui'

export default {
  name: 'bax-reset-email',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    uid: {
      type: Number,
      required: true,
      default: -1
    }
  },
  data() {
    return {
      email: ''
    }
  },
  methods: {
    empty() {
      this.email = ''
    },
    cancel() {
      this.empty()
    },
    async submit() {
      const {
        email,
        uid
      } = this

      if (!email) {
        return Message.error('请填写 email')
      }

      await updateUserInfo(uid, {
        email
      })

      this.empty()

      await getCurrentUser()

      Message.success('添加成功')
    }
  }
}

</script>

<style scoped>

.tip {
  color: red;
  padding-left: 80px;
}

</style>
