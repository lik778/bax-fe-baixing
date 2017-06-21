<template>
  <header>
    <slot></slot>
  </header>
</template>

<script>
  export default {
    name: 'section-header'
  }
</script>

<style scoped>
  header {
    height: 30px;
    border-radius: 4px;
    margin: 15px 0;
    padding: 0 15px;
    line-height: 30px;
    color: #6a778c;
    background-color: #e5e9f2;
  }
</style>
