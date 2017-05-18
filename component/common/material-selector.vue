
<template>
  <bax-select v-model="localValue"
    :placeholder="placeholder"
    :clearable="clearable"
    :multiple="multiple"
    :options="mOpts"
    :filter-method="query" />
</template>

<script>

import 'rxjs/add/operator/debounceTime'
import { Subject } from 'rxjs/Subject'

import BaxSelect from './select'

import {
  getMaterials
} from 'api/material'

export default {
  name: 'bax-material-selector',
  components: {
    BaxSelect
  },
  props: {
    placeholder: String,
    clearable: Boolean,
    multiple: Boolean,
    value: {
      type: [String, Number, Array]
    }
  },
  data() {
    return {
      localValue: this.value,
      materials: []
    }
  },
  methods: {
    query(v) {
      console.debug('query', v)
      this.throttle.next(v)
    },
    setValue(v) {
      this.$emit('change', v)
      this.$emit('input', v)

      if (v === this.localValue) {
        return
      }

      this.localValue = v
    },
    async queryMaterials(v) {
      const { materials = [] } = await getMaterials({name: v})
      this.materials = materials
    }
  },
  watch: {
    localValue(v) {
      this.setValue(v)
    },
    value(v) {
      if (v === this.localValue) {
        return
      }

      this.localValue = v
      console.debug('value changed', v)
      this.throttle.next(v)
    }
  },
  computed: {
    mOpts() {
      return this.materials.map(m => ({
        label: m.name,
        value: m.id
      }))
    }
  },
  beforeMount() {
    this.throttle = new Subject().debounceTime(800)
  },
  beforeDestroy() {
    this.throttle.unsubscribe()
  },
  async mounted() {
    this.throttle.subscribe(this.queryMaterials)
    await this.queryMaterials()
  }
}

</script>
