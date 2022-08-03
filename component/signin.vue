
<template>
  <main>
    <header>BAX 广告交易平台</header>
    <form v-if="!isFengMing" class="box">
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
    <div v-else class="fengming-admin">
      <p class="fengming-tip">请跳转到易白搜后台登录</p>
      <p class="fengming-submit">
       <a class="fengming-dev" href="">跳转</a>
        <button class="fengming-reload" @click="onload">已登录，刷新</button>
      </p>
    </div>
  </main>
</template>

<script>
import { isPro } from 'config'

import {
  allowVerifyAd,
  parseQuery
} from 'util'
import {
  redirectTo
} from 'utils'

import {
  getCurrentUser,
  login
} from 'api/account'

export default {
  name: 'signin',
  data () {
    return {
      password: '',
      email: '',
      redirectHref: '',
      isFengMing: false
    }
  },
  created () {
    const query = parseQuery(window.location.search.substring(1))
    const returnUrl = query.return || ''
    this.redirectHref = isPro ? `https://www.baixing.com/fengming/bax?redirect_url=${returnUrl}` : `http://www.zhubailin.baixing.cn/fengming/bax?redirect_url=${returnUrl}`
    if (returnUrl.indexOf('/fengming/') !== -1) {
      this.isFengMing = true
    } else {
      this.isFengMing = false
    }
  },
  methods: {
    async login () {
      const { password, email } = this
      if (!password || !email) {
        return alert('请输入邮箱和密码哟 >_<')
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
    },
    async onload () {
      await getCurrentUser()
      const query = parseQuery(window.location.search.substring(1))
      if (query.return) {
        location.href = location.origin + query.return
      }
    }
  }
}
</script>

<style lang="scss">
* {
  font-family: PingFangSC-Regular, "Open Sans", "Microsoft YaHei", 微软雅黑,
    STHeiti, "WenQuanYi Micro Hei", SimSun, sans-serif;
  -webkit-tap-highlight-color: transparent;
  vertical-align: baseline;
  box-sizing: border-box;
  font-size: 100%;
  outline: 0;
  padding: 0;
  margin: 0;
  border: 0;
}

html {
  font-family: "Hiragino Sans GB", helvetica, tahoma, arial, sans-serif;
}

html,
body {
  height: 100%;
}

a {
  background-color: transparent;
  text-decoration: none;
}

i {
  font-style: normal;
}

ul,
li {
  list-style: none;
}

a,
span,
aside,
label,
strong {
  display: inline-block;
}

textarea {
  resize: none;
}

dialog {
  margin: auto;
}
</style>

<style lang="scss" scoped>
.fengming-admin {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 420px;
  height: 220px;
  padding: 15px 20px 0;
  border-radius: 5px;
  border-radius: 4px;
  background: rgba(216, 216, 216, 0.3);
  .fengming-tip {
    text-align: center;
    font-size: 16px;
    color: #616161;
  }
  .fengming-dev {
    width: 100px;
    height: 36px;
    line-height: 36px;
    margin-right: 30px;
    text-align: center;
    border: 1px solid #83e5e7;
    border-radius: 4px;
    background: #7ddede;
    color: #616161;
    cursor: pointer;
  }
  .fengming-reload {
    width: 120px;
    height: 36px;
    text-align: center;
    line-height: 36px;
    border-radius: 4px;
    border: 1px solid white;
    font-size: 14px;
    color: white;
    background: rgba(216, 216, 216, 0.3);
    cursor: pointer;
  }
  .fengming-submit {
    margin-top: 30px;
    display: flex;
    justify-content: center;
  }
}
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
  background: rgba(216, 216, 216, 0.3);

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
    box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.5);
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
    @include center;
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
    @include center;
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
  background: url("//file.baixing.net/bax-fe/asset/signin-bg.jpg");
  background-repeat: no-repeat;
  background-size: cover;

  & > header {
    @include center;
    margin-bottom: 60px;
    width: 420px;
    font-family: Arial Black;
    font-size: 36px;
    color: black;
  }
}
</style>
