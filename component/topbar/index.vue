
<template>
  <header>
    <span>
      <i class="el-icon-arrow-left"></i>
      <slot name="title"></slot>
    </span>
    <span>
      <i class="el-icon-message"></i>
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userInfo.name }}
          <i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>修改密码</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </span>
  </header>
</template>

<script>

export default {
  name: 'topbar',
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  }
}

</script>

<style scoped>

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;
  height: 60px;
}

</style>
