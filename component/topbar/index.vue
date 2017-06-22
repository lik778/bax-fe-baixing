
<template>
  <header class="topbar">
    <span>
      <i v-if="back" class="el-icon-arrow-left"
        @click="goBack" />
      <slot name="title" />
    </span>
    <span>
      <i class="el-icon-message" />
      <el-dropdown @command="onDropdownCmd">
        <span class="el-dropdown-link">
          {{ userInfo.name }}
          <i class="el-icon-caret-bottom el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="changePwd">
            修改密码
          </el-dropdown-item>
          <el-dropdown-item command="logout">
            退出
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </span>
    <el-dialog title="修改密码" v-model="pwdDialogVisible" size="small">
      <el-form label-width="120px">
        <el-form-item label="密码" required>
          <el-input type='password' placeholder="请输入新密码"
            v-model="newPassword" />
        </el-form-item>
        <el-form-item label="确认密码" required>
          <el-input type='password' placeholder="请确认新密码"
            v-model="confirmPassword" />
        </el-form-item>
      </el-form>
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
// TODO - split change password
import { Message } from 'element-ui'
import { redirectTo } from 'utils'

import {
  updateUserInfo,
  logout
} from 'api/account'

export default {
  name: 'topbar',
  props: {
    userInfo: {
      type: Object,
      required: true
    },
    back: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      pwdDialogVisible: false,
      confirmPassword: '',
      newPassword: ''
    }
  },
  methods: {
    async onDropdownCmd(cmd) {
      switch (cmd) {
        case 'changePwd':
          this.pwdDialogVisible = true
          break
        case 'logout':
          await logout()
          redirectTo('signin')
          break
      }
    },
    async changePassword() {
      const {
        confirmPassword,
        newPassword,
        userInfo
      } = this

      if (!newPassword) {
        return Message.error('请输入新密码哟 !')
      }

      if (confirmPassword !== newPassword) {
        return Message.error('两次输入的密码不一致哟 ~')
      }

      await updateUserInfo(userInfo.id, {
        password: newPassword
      })

      this.pwdDialogVisible = false

      this.empty()

      Message.success('修改成功')
    },
    empty() {
      this.confirmPassword = ''
      this.newPassword = ''
    },
    cancel() {
      this.pwdDialogVisible = false
      this.empty()
    },
    goBack() {
      window.history.back()
    }
  }
}

</script>

<style scoped>

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;
  height: 60px;

  & > span:first-child {
    display: inline-flex;
    align-items: center;
    flex-grow: 0.6;
    cursor: pointer;

    & > i {
      margin-right: 5px;
    }
  }
}

</style>
