
<template>
  <label class="btn">
    <slot />
  </label>
</template>

<script>
export default {
  name: 'flat-btn'
}
</script>

<style lang="scss" scoped>
.btn {
  font-size: 14px;
  color: #15a4fa;
  cursor: pointer;
}
</style>
