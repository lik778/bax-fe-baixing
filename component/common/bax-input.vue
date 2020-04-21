<template>
  <input class="bax-input"
         :placeholder="placeholder"
         :value="value"
         @blur="onBlur"
         @keyup.enter="onKeyUp" />
</template>

<script>
export default {
  name: 'bax-input',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    size: {
      type: String,
      default: 'small',
    }
  },
  methods: {
    onBlur(event) {
      this.$emit('blur', event.target.value)
    },
    onKeyUp(event) {
      this.$emit('keyup',event.target.value)
    }
  }
}
</script>

<style lang="postcss" scoped>
.bax-input {
  width:  120px;
  border-radius: 4px;
  padding: 4px 6px;
  background: #fff;
  border: 1px solid #eee;
  &::placeholder {
    font-size: 12px;
    color: #999;
  }
}
</style>