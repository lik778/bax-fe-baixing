<template>
  <div class="wrapper">
    <p :class="{warning: rest < 0}">
      {{ text }}
    </p>
    <slot name="input"></slot>
  </div>
</template>

<script>
export default {
  name: 'text-limit-tip',
  props: {
    rest: {
      type: Number,
      default: 0
    }
  },
  computed: {
    text() {
      const { rest } = this

      if (rest < 0) {
        return `超出${Math.abs(rest)}字`
      }

      return `还能输入${rest}字`
    }
  }
}
</script>

<style scoped>
.wrapper {
  display: inline-flex;
  flex-flow: column;
  align-items: flex-end;

  & > p {
    position: relative;
    bottom: 16px;
    right: 10px;
    width: 78px;
    height: 0;
    text-align: end;
    font-size: 11px;
    color: #6a778c;
  }

  & > p.warning {
    color: red;
  }
}
</style>
