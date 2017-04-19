
<template>
  <el-select v-model="value" :multiple="multiple" filterable
    :filter-method="filterMethod">
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
    filterMethod: Function,
    multiple: Boolean
  },
  data() {
    return {
      value: ''
    }
  },
  watch: {
    value(v) {
      this.$emit('change', v)
    }
  }
}

</script>

<style>

</style>
