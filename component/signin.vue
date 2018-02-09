
<template>
  <main>
    <div>
      <header>BAX广告交易平台</header>
      <content>
        <p>登录</p>
        <input placeholder="邮箱" v-model="email" />
        <input placeholder="密码" type="password" v-model="password" />
        <footer>
          <a href="http://www.baixing.com/fengming/bax">
            百姓网账号登录
          </a>
          <span @click="login">
            登录
          </span>
        </footer>
      </content>
    </div>
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

main {
  display: flex;
  flex-flow:column;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
  height: 100%;
  min-width: 960px;
  background: url('//bax-static.baixingcdn.com/bax-asset.signin-bg.jpg');
  background-repeat: no-repeat;
  background-size: cover;

  & > div {
    margin-right: 36px;

    & > header {
      @mixin center;
      font-family: Arial Black;
      color: black;
      font-size: 36px;
      margin-bottom: 60px;
    }

    & > content {
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
        color: #AFAFAF;
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
          background: #7DDEDE;
          border: 1px solid #83E5E7;
          /* box-shadow: 0 1px 2px 0 rgba(0,0,0,0.20), inset 0 2px 0 0 #ffffff; */
          border-radius: 4px;
          cursor: pointer;
          color: #616161;
        }
      }
    }
  }
}
</style>
