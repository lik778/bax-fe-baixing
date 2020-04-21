<template>
  <input class="bax-input" 
         :placeholder="placeholder"
         :value="value"
         @blur="onBlur($event, s)"
         @keyup="onKeyUp($event, s)" />
</template>

<script>
export default {
  name: 'Bax-input',
  props: ['value', 'placeholder', 's'],
  methods: {
    onBlur() {
      this.$emit('blur', s)
    },
    onKeyUp() {
      this.$emit('key-up', s)
    }
  }
}
</script>

<style lang="postcss" scoped>
</style>