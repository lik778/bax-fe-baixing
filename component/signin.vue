
<template>
  <content>
    <div>
      <el-input placeholder="邮箱" v-model="email"></el-input>
      <el-input placeholder="密码" type="password" v-model="password">
      </el-input>
      <el-button type="primary" @click="login()">登录</el-button>
    </div>
  </content>
</template>

<script>

import { login } from 'api/account'

export default {
  name: 'signin',
  data() {
    return {
      password: '',
      email: ''
    }
  },
  methods: {
    async login() {
      const { password, email } = this
      if (!password || !email) {
        return this.$message({
          message: '请输入邮箱和密码哟 >_<',
          type: 'error'
        })
      }

      await login(email, password)

      location.pathname = location.pathname
        .replace('signin.html', 'bax.html')
    }
  }
}

</script>

<style>

@import 'cssbase/reset';

</style>

<style scoped>

@import 'cssbase/mixin';

content {
  @mixin center;
  width: 100%;
  height: 100%;

  & > div {
    width: 500px;
    height: 200px;
  }
}

</style>
