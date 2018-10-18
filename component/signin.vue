
<template>
  <main>
    <header>BAX 广告交易平台</header>
    <form class="box">
      <p>登录</p>
      <input
        placeholder="邮箱"
        v-model="email"
      />
      <input
        autocomplete
        type="password"
        placeholder="密码"
        v-model="password"
      />
      <a :href="redirectHref">
        百姓网账号登录
      </a>
      <span @click="login">
        登录
      </span>
    </form>
  </main>
</template>

<script>
import { Message } from 'element-ui'
import { isPro } from 'config'

import {
  allowVerifyAd,
  parseQuery,
  redirect
} from 'util'

import {
  getCurrentUser,
  login
} from 'api/account'

export default {
  name: 'signin',
  data() {
    return {
      password: '',
      email: '',
      redirectHref: ''
    }
  },
  created () {
    this.redirectHref = isPro ? 'http://www.baixing.com/fengming/bax' : 'http://www.zhubailin.baixing.com/fengming/bax'
  },
  methods: {
    async login() {
      const { password, email } = this
      if (!password || !email) {
        return Message.error('请输入邮箱和密码哟 >_<')
      }

      await login(email, password)

      const userInfo = await getCurrentUser()

      const query = parseQuery(window.location.search.substring(1))
      if (query.return) {
        location.href = location.origin + query.return
        return
      }

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
  display: grid;
  grid-template-rows: 40px 55px 55px;
  grid-template-columns: 4fr 2fr;
  align-items: start;
  grid-template-areas:
    "title title"
    "email email"
    "password password"
    "bxLogin submit";
  width: 420px;
  height: 220px;
  padding: 15px 20px 0;
  border-radius: 5px;
  border-radius: 4px;
  background: rgba(216, 216, 216, 0.30);

  & > p {
    grid-area: title;
    font-size: 16px;
    color: #616161;
  }

  & > input {
    width: 380px;
    height: 36px;
    padding: 0 5px;
    border: 1px solid #979797;
    box-shadow: inset 0 1px 3px 0 rgba(0,0,0,0.50);
    border-radius: 4px;
    font-size: 14px;
    color: #afafaf;
  }

  & > input:nth-child(2) {
    grid-area: email;
  }

  & > input:nth-child(3) {
    grid-area: password;
  }

  & > a {
    @mixin center;
    grid-area: bxLogin;
    justify-self: end;
    width: 120px;
    height: 36px;
    border-radius: 4px;
    border: 1px solid white;
    font-size: 14px;
    color: white;
  }

  & > span {
    @mixin center;
    grid-area: submit;
    justify-self: end;
    width: 100px;
    height: 36px;
    border: 1px solid #83e5e7;
    border-radius: 4px;
    background: #7ddede;
    color: #616161;
    cursor: pointer;
  }
}

main {
  display: flex;
  flex-flow: column;
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
