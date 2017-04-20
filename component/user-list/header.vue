
<template>
  <header class="user-header">
    <div>
      <el-button @click="addUser">新增</el-button>
    </div>
  </header>
</template>

<script>

export default {
  name: 'user-header',
  methods: {
    addUser() {
      this.$emit('create-user')
    }
  }
}

</script>

<style scoped>

@import '../../cssbase/mixin';

.user-header {
  @mixin top-filter;
  height: 80px;
  padding: 20px;
}

</style>
