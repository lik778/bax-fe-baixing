<template>
  <div>
    <div class="header">
      <router-link to="/main" class="logo" tag="h1">搜索通</router-link>
      <p class="version" v-once>v{{version}}</p>
      <ul class="nav">
        <!-- <li class="nav-item" @click="isDialogVisible = true">联系客服&nbsp;400-036-3650</li> -->
        <!-- <li
          class="nav-item"
          @mouseenter="() => this.isHelpVisible = true"
          @mouseleave="() => this.isHelpVisible = false"
        >
          帮助中心
          <i :class="isHelpVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"/>
          <transition name="el-zoom-in-top">
            <div class="menu-group help" v-show="isHelpVisible">
              <a target="_blank" href="/qa?mode=tutorials" class="menu-item link">操作指南</a>
              <a target="_blank" href="/qa?mode=questions" class="menu-item link">常见问题</a>
            </div>
          </transition>
        </li> -->
        <li
          class="nav-item menu"
          @mouseenter="() => this.isMenuVisible = true"
          @mouseleave="() => this.isMenuVisible = false"
        >
          {{userInfo.name || '我是小小百姓'}}
          <i :class="isMenuVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"/>
          <transition name="el-zoom-in-top">
            <ul class="menu-group" v-show="isMenuVisible" @click="handleMenuClick">
              <!-- <li class="menu-item" data-command="account">我的账户</li> -->
              <!-- <li class="menu-item" data-command="back">返回百姓网</li> -->
              <li class="menu-item" data-command="logout">退出</li>
            </ul>
          </transition>
        </li>
      </ul>
    </div>
    <!-- <add-user-lead :visible="isDialogVisible" :userInfo="userInfo" @close="isDialogVisible = false"/> -->
  </div>
</template>

<script>
import { redirectTo } from 'utils'
import { logout } from 'api/account'
import { version } from '../../package.json'
// import AddUserLead from 'com/common/add-user-lead'

export default {
  name: 'layout-header',
  data () {
    return {
      version,
      isMenuVisible: false,
      isHelpVisible: false,
      isDialogVisible: false
    }
  },
  // components: { AddUserLead },
  props: ['userInfo'],
  methods: {
    async handleMenuClick (e) {
      switch (e.target.dataset.command) {
        case 'account':
          return this.$router.push({ name: 'account' })
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

<style lang="scss" scoped>
.header {
  position: fixed;
  z-index: 998;
  display: flex;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background-image: linear-gradient(-179deg, #ff4d4d 0%, #ff8955 100%);
  box-shadow: 0 2px 9px 0 rgba(83, 95, 127, 0.1);
  & .logo {
    flex: none;
    width: 108px;
    height: 50px;
    overflow: hidden;
    text-indent: -9999px;
    background: url("//file.baixing.net/201902/ddec176c9e5d2dd736e6d9948686ffee.png")
      23px center no-repeat;
    background-size: 80px 35px;
  }
  & .version {
    color: #fff;
    font-size: 13px;
    margin-left: 8px;
    margin-top: 13px;
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
    &.help {
      right: 4px;
    }
    &:before {
      content: "";
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -16px;
      border: 9px solid transparent;
      border-bottom-color: #fff;
    }
    &:after {
      content: "";
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
      &.link {
        display: block;
        color: #333;
        padding: 0 20px;
      }
      &:hover {
        color: #ff6350;
        background-color: #fff7eb;
      }
    }
  }
}
</style>
