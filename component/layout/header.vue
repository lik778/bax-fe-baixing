<template>
  <div>
    <div class="header">
      <router-link to="/main">
        <h1 class="logo">全网通</h1>
      </router-link>
      <ul class="nav">
        <li class="nav-item" @click="isDialogVisible = true">联系客服&nbsp;400-036-3650</li>
        <router-link class="nav-item help" to="/main/operation-log" tag="li">帮助中心</router-link>
        <li
          class="nav-item menu"
          @mouseenter="() => toggleMenuVisible(true)"
          @mouseleave="() => toggleMenuVisible(false)">
          {{userInfo.name}}
          <i :class="isMenuVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"/>
          <transition name="el-zoom-in-top">
            <ul class="menu-group" v-show="isMenuVisible" @click="handleMenuClick">
              <li class="menu-item" data-command="account">我的账户</li>
              <li class="menu-item" data-command="back">返回百姓网</li>
              <li class="menu-item" data-command="logout">退出</li>
            </ul>
          </transition>
        </li>
      </ul>
    </div>
    <add-user-lead :visible="isDialogVisible" :userInfo="userInfo" @close="isDialogVisible = false"/>
  </div>
</template>

<script>
  import { redirectTo } from 'utils'
  import { logout } from 'api/account'
  import AddUserLead from 'com/common/add-user-lead'

  export default {
    name: 'layout-header',
    data () {
      return {
        isMenuVisible: false,
        isDialogVisible: false
      }
    },
    components: {AddUserLead},
    props: ['userInfo'],
    methods: {
      toggleMenuVisible(visible) {
        this.isMenuVisible = visible
      },
      async handleMenuClick(e) {
        switch(e.target.dataset.command) {
          case 'account':
            return this.$route.push()
          case 'back':
            return console.log('百姓')
          case 'logout':
            await logout()
            return redirectTo('signin')
          default:
            this.isMenuVisible = false
        }
      }
    }
  }
</script>

<style lang="postcss" scoped>
  .header {
    position: fixed;
    z-index: 1;
    display: flex;
    align-items: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background-image: linear-gradient(-179deg, #FF4D4D 0%, #FF8955 100%);
    box-shadow: 0 2px 9px 0 rgba(83,95,127,0.10);
    & .logo {
      flex: none;
      width: 108px;
      height: 50px;
      overflow: hidden;
      text-indent: -9999px;
      background: url('http://file.baixing.net/201809/072639ff317bcec3be97c2235918f786.png') 23px center no-repeat;
      background-size: 85px 24.7px;
    }
    & .nav {
      margin-left: auto;
      font-size: 14px;
      padding-right: 20px;
      color: #fff;
    }
    & .nav-item {
      position: relative;
      padding: 0 25px;
      float: left;
      cursor: pointer;
      &.help, &.menu {
        cursor: pointer;
      }
      &:not(.menu) {
        border-right: 1px solid #fff;
      }
      &.menu {
        text-align: right;
        min-width: 150px;
      }
    }
    & .menu-group {
      position: absolute;
      top: 30px;
      right: 24px;
      line-height: 45px;
      color: #333;
      text-align: left;
      background-color: #fff;
      border-radius: 3px;
      border: 1px solid #eee;
      z-index: 100;
      &:before {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: -16px;
        border: 9px solid transparent;
        border-bottom-color: #fff;
      }
      &:after {
        content: '';
        position: absolute;
        top: -20px;
        left: -50px;
        right: -30px;
        height: 22px;
        z-index: -1;
      }
      & .menu-item {
        padding: 0 20px;
        letter-spacing: 1px;
        &:hover {
          color: #FF6350;
          background-color: #FFF7EB;
        }
      }
    }
  }
</style>
