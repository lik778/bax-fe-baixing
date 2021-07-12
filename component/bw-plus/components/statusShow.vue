<template>
  <div>
     <span :class="['dot', dotColor]" />
     <slot />
  </div>
</template>

<script>
export default {
  name: 'statusShow',
  props: {
    dotColor: {
      type: String,
      required: false
    }
  }
}
</script>

<style lang="scss" scoped>
.dot {
  border-radius: 50%;
  width: 6px;
  height: 6px;
  &.info {
    background: $c-ignore;
  }
  &.success {
    background: $c-success;
  }
  &.warning {
    background: $c-strong;
  }
}
</style>
