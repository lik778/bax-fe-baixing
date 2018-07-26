<template>
  <div class="wrapper">
    <p :class="{warning}">
      {{ text }}
    </p>
    <slot name="input"></slot>
  </div>
</template>

<script>
export default {
  name: 'text-limit-tip',
  props: {
    current: {
      type: Number,
      default: 0
    },
    rest: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: 0
    }
  },
  computed: {
    warning() {
      const { current, rest, min } = this
      return rest < 0 || (current && current < min)
    },
    text() {
      const { current, rest, min } = this

      if (current && (current < min)) {
        return `不足${min}字`
      }

      if (rest < 0) {
        return `超出${Math.abs(rest)}字`
      }

      return `还能输入${rest}字`
    }
  }
}
</script>

<style lang="postcss" scoped>
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
