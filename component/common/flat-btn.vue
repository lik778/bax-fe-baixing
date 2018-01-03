
<template>
  <span class="btn">
    <slot />
  </span>
</template>

<script>
export default {
  name: 'flat-btn'
}
</script>

<style scoped>
.btn {
  padding: 2px 5px;
  border-radius: 4px;
  color: white;
  background-color: #0b9eff;
  cursor: pointer;
}
</style>
