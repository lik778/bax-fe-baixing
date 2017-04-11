
<template>
  <main>
    <header>
      BAX SSP
    </header>
    <content>
      <el-menu default-active="1">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-message"></i>投放管理
          </template>
          <el-menu-item index="1-1">
            <router-link to="/materials" tag="p">
              广告投放
            </router-link>
          </el-menu-item>
          <el-menu-item index="1-2">
            <router-link to="/materials" tag="p">
              物料管理
            </router-link>
          </el-menu-item>
          <el-menu-item index="1-3">
            <router-link to="/orders" tag="p">
              订单管理
            </router-link>
          </el-menu-item>
          <el-menu-item index="1-4">
            <router-link to="/users" tag="p">
              客户管理
            </router-link>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="1-1">
          <i class="el-icon-menu"></i>设置
        </el-menu-item>
        <el-menu-item index="1-1">
          <i class="el-icon-setting"></i>账户
        </el-menu-item>
      </el-menu>
    </content>
  </main>
</template>

<script>

export default {
  name: 'sidebar'
}

</script>

<style scoped>

@import '../../cssbase/var';

main {
  & header {
    display: flex;
    justify-content: center;
    padding-top: 15px;
    height: 90px;
    font-size: 20px;
    color: #768396;
  }

  min-width: 180px;
  width: 180px;
  height: 100%;
  background: var(--c-gray);
}

</style>
