<template>
  <header>
    <slot></slot>
  </header>
</template>

<script>
export default {
  name: "section-header"
};
</script>

<style lang="scss" scoped>
header {
  margin-top: 10px;
  color: #666;
  font-weight: 600;
  margin-bottom: 15px;
}
</style>
