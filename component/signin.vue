
<template>
  <main>
    <div>
      <header>BAX</header>
      <el-input placeholder="邮箱" v-model="email" />
      <el-input placeholder="密码" type="password" v-model="password" />
      <footer>
        <el-button type="primary" @click="login()">登录</el-button>
      </footer>
    </div>
  </main>
</template>

<script>

import { login } from 'api/account'
import { redirectTo } from 'utils'

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

      redirectTo('bax')
    }
  }
}

</script>

<style>

@import 'cssbase/reset';

</style>

<style scoped>

@import 'cssbase/mixin';

main {
  @mixin center;
  width: 100%;
  height: 100%;

  & > div {
    width: 500px;
    height: 300px;
    border-radius: 5px;
    background: #333333;
    padding: 30px 20px;

    & > header {
      @mixin center;
      margin-bottom: 20px;
      color: white;
      font-size: 26px;
    }

    & > .el-input {
      margin: 10px 0;
    }

    & > footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
      padding-right: 20px;
    }
  }
}

</style>
