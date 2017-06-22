
<template>
  <bax-select v-model="localValue"
    :placeholder="placeholder"
    :clearable="clearable"
    :multiple="multiple"
    :options="opts" />
</template>

<script>

import BaxSelect from './select'

import {
  getKeywords,
  getPlans
} from 'api/fengming-report'

export default {
  name: 'bax-qwt-plan-keyword-selector',
  components: {
    BaxSelect
  },
  props: {
    placeholder: String,
    clearable: Boolean,
    multiple: Boolean,
    channel: {
      type: Number,
      default: 5
    },
    value: {
      type: [String, Number, Array]
    }
  },
  data() {
    return {
      localValue: this.value,
      keywords: [],
      plans: []
    }
  },
  methods: {
    setValue(v) {
      this.$emit('change', v)
      this.$emit('input', v)

      if (v === this.localValue) {
        return
      }

      this.localValue = v
    },
    async queryPlanAndKeyword() {
      const { channel } = this

      const [
        keywords,
        plans
      ] = await Promise.all([
        getKeywords({channel}),
        getPlans({channel})
      ])

      this.keywords = keywords
      this.plans = plans
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
    }
  },
  computed: {
    opts() {
      const {
        keywords,
        plans
      } = this

      return [
        ...keywords.map(k => ({
          label: k.keyword,
          value: 'k-' + k.id
        })),
        ...plans.map(p => ({
          label: p.plan,
          value: 'p-' + p.id
        }))
      ]
    }
  },
  async mounted() {
    await this.queryPlanAndKeyword()
  }
}

</script>
