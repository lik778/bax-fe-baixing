
<template>
  <el-select v-model="localValue" :multiple="multiple"
    :disabled="disabled" :size="size"
    :clearable="clearable" filterable
    :placeholder="placeholder"
    :filter-method="filterMethod">
    <el-option v-for="opt in options"
      :key="opt.value"
      :label="opt.label"
      :value="opt.value">
    </el-option>
  </el-select>
</template>

<script>
import equal from 'lodash.isequal'

export default {
  name: 'bax-select',
  props: {
    options: {
      type: Array,
      required: true
    },
    filterMethod: {
      type: Function,
      default: () => {}
    },
    clearable: {
      type: Boolean,
      default: () => true
    },
    placeholder: String,
    multiple: Boolean,
    value: {
      type: [String, Number, Array]
    },
    disabled: Boolean,
    size: String
  },
  data () {
    return {
      localValue: this.value
    }
  },
  methods: {
    setValue (v) {
      console.debug('select: set value')
      this.$emit('change', v)
      this.$emit('input', v)

      if (equal(v, this.localValue)) {
        return
      }

      this.localValue = v
    }
  },
  watch: {
    localValue (v) {
      this.setValue(v)
    },
    value (v) {
      // multiple -> array
      if (equal(v, this.localValue)) {
        return
      }

      this.localValue = v
    }
  }
}
</script>
