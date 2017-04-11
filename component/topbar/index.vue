
<template>
  <header>
    <span>
      <i class="el-icon-arrow-left"></i>
      <slot name="title"></slot>
    </span>
    <span>
      <i class="el-icon-message"></i>
      <el-dropdown @click="onClickDropdown">
        <span class="el-dropdown-link">
          {{ userInfo.name }}
          <i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            修改密码
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </span>
    <el-dialog title="修改密码" v-model="pwdDialogVisible" size="small">
      <el-input type="password" placeholder="请输入新密码" v-model="newPassword">
      </el-input>
      <span slot="footer">
        <el-button @click="cancel">
          取消
        </el-button>
        <el-button type="primary" @click="changePassword">
          确认
        </el-button>
      </span>
    </el-dialog>
  </header>
</template>

<script>

import { updateUserInfo } from 'api/account'

import { Message } from 'element-ui'

export default {
  name: 'topbar',
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      pwdDialogVisible: false,
      newPassword: ''
    }
  },
  methods: {
    async changePassword() {
      const { userInfo, newPassword } = this

      if (!newPassword) {
        return Message.error('请输入新密码哟 !')
      }

      await updateUserInfo(userInfo.id, {
        password: newPassword
      })

      this.pwdDialogVisible = false
      this.newPassword = ''

      Message.success('修改成功')
    },
    cancel() {
      this.pwdDialogVisible = false
    }
  }
}

</script>

<style scoped>

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;
  height: 60px;
}

</style>
