
<template>
  <header class="topbar">
    <span></span>
    <span>
      <label class="help" @click="help">
        联系客服 400-036-3650
      </label>
      <slot name="right" />
      <label>
        <el-dropdown @command="onDropdownCmd">
          <span class="el-dropdown-link">
            {{ userInfo.name }}
            <i class="el-icon-caret-bottom el-icon--right"></i>
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
      </label>
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
  toggleAddUserLeadVisible
} from '../action'

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
    help() {
      toggleAddUserLeadVisible()
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
@import '../../cssbase/mixin';

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 50px;
  height: 50px;
  padding: 0 35px;
  background: white;

  & > span:nth-child(2) {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-grow: 1;

    & > label {
      display: flex;
      align-items: center;
      height: 23px;
    }

    & > label:not(:last-child) {
      margin-right: 30px;
      padding-right: 30px;
      border-right: solid 1px #e6e6e6;
    }
  }
}

.help {
  justify-content: flex-start;
  opacity: 0.89;
  font-size: 14px;
  color: #999999;
  cursor: pointer;
}

</style>
