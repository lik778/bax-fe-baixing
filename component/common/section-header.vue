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

<style lang="postcss" scoped>
  header {
    /* height: 30px;
    border-radius: 4px;
    margin: 15px 0;
    padding: 0 15px;
    line-height: 30px;
    background-color: #e5e9f2; */
    margin-top: 10px;
    color: #666;
    font-weight: 600;
    margin-bottom: 15px;
  }
</style>
