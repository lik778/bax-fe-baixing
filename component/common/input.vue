
<template>
  <el-input v-model="localValue"
    :placeholder="placeholder"
    :icon="icon"
    :type="type" />
</template>

<script>

import 'rxjs/add/operator/debounceTime'
import { Subject } from 'rxjs/Subject'

export default {
  name: 'bax-input',
  props: {
    placeholder: {
      type: String
    },
    value: {
      type: String
    },
    icon: {
      type: String
    },
    type: {
      type: String,
      default: () => 'text'
    }
  },
  data() {
    return {
      localValue: this.value
    }
  },
  methods: {
    setValue(v) {
      console.debug('input: set value')
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
      console.debug('input:watch:localValue')
      this.throttle.next(v)
    },
    value(v) {
      console.debug('input:watch:value', v, this.localValue)
      if (v === this.localValue) {
        return
      }

      this.localValue = v
    }
  },
  beforeMount() {
    this.throttle = new Subject().debounceTime(600)
  },
  beforeDestroy() {
    this.throttle.unsubscribe()
  },
  async mounted() {
    this.throttle.subscribe(this.setValue)
  }
}

</script>