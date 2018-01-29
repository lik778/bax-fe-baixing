<template>
  <i :class="'iconfont icon-' + type"></i>
</template>

<script>
export default {
  name: 'qwt-bx-icon',
  props: {
    type: {
      type: String,
      required: true
    }
  }
}
</script>
