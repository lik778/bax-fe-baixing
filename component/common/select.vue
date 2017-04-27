
<template>
  <el-select v-model="localValue" :multiple="multiple"
    :clearable="clearable" filterable
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
    clearable: Boolean,
    multiple: Boolean,
    value: {
      type: [String, Number, Array]
    }
  },
  data() {
    return {
      localValue: this.value
    }
  },
  methods: {
    setValue(v) {
      console.debug('select: set value')
      this.$emit('change', v)
      this.$emit('input', v)

      if (v === this.localValue) {
        return
      }

      this.localValue = v
    }
  },
  watch: {
    localValue(v) {
      console.debug('select:watch:localValue')
      this.setValue(v)
    },
    value(v) {
      console.debug('select:watch:value', v, this.localValue)
      if (v === this.localValue) {
        return
      }

      this.localValue = v
    }
  }
}

</script>

<style>

</style>
