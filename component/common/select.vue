
<template>
  <el-select v-model="value">
    <el-option v-for="opt in options"
      :label="opt.label"
      :value="opt.value">
    </el-option>
  </el-select>
</template>

<script>

export default {
  name: 'bax-select',
  props: {
    options: {
      type: Array,
      required: true
    },
    onChange: {
      type: Function,
      required: true
    },
    multiple: Boolean
  },
  data() {
    return {
      value: ''
    }
  },
  watch: {
    value(v) {
      this.onChange(v)
    }
  }
}

</script>

<style>

</style>
