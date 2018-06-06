
<template>
  <main>
    <header>BAX广告交易平台</header>
    <form class="box">
      <p>登录</p>
      <input placeholder="邮箱" v-model="email" />
      <input
        autocomplete
        type="password"
        placeholder="密码"
        v-model="password" />
      <footer>
        <a href="http://www.baixing.com/fengming/bax">
          百姓网账号登录
        </a>
        <span @click="login">
          登录
        </span>
      </footer>
    </form>
  </main>
</template>

<script>
import { Message } from 'element-ui'
import { redirectTo } from 'utils'

import {
  allowVerifyAd
} from 'util/role'

import {
  getCurrentUser,
  login
} from 'api/account'

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
        return Message.error('请输入邮箱和密码哟 >_<')
      }

      await login(email, password)

      const userInfo = await getCurrentUser()

      if (allowVerifyAd(userInfo.roles)) {
        return redirectTo('main/ads')
      }

      redirectTo('main/orders')
    }
  }
}
</script>

<style>
@import 'cssbase/reset';
</style>

<style scoped>
@import 'cssbase/mixin';

.box {
  display: flex;
  flex-flow: column;
  width: 420px;
  height: 220px;
  padding: 15px 20px 0;
  border-radius: 5px;
  border-radius: 4px;
  background: rgba(216, 216, 216, 0.30);

  & > p {
    font-size: 16px;
    color: #616161;
    letter-spacing: 0;
  }

  & > input {
    width: 380px;
    height: 36px;
    margin-top: 20px;
    padding: 0 5px;
    color: #afafaf;
    font-size: 14px;
    border: 1px solid #979797;
    box-shadow: inset 0 1px 3px 0 rgba(0,0,0,0.50);
    border-radius: 4px;
  }

  & > footer {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding: 20px 20px 0 0;

    & > a {
      @mixin center;
      margin-right: 10px;
      padding: 0 10px;
      height: 36px;
      font-size: 14px;
      border-radius: 4px;
      border: 1px solid white;
      color: white;
    }

    & > span {
      @mixin center;
      width: 100px;
      height: 36px;
      background: #7ddede;
      border: 1px solid #83e5e7;
      border-radius: 4px;
      cursor: pointer;
      color: #616161;
    }
  }
}

main {
  display: flex;
  flex-flow:column;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
  height: 100%;
  min-width: 960px;
  padding-right: 36px;
  background: url('//file.baixing.net/bax-fe/asset/signin-bg.jpg');
  background-repeat: no-repeat;
  background-size: cover;

  & > header {
    @mixin center;
    margin-bottom: 60px;
    width: 420px;
    font-family: Arial Black;
    font-size: 36px;
    color: black;
  }
}
</style>
