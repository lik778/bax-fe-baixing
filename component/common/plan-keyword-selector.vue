
<template>
  <bax-select v-model="localValue"
    :placeholder="placeholder"
    :clearable="clearable"
    :multiple="multiple"
    :options="opts">
  </bax-select>
</template>

<script>
import pick from 'lodash/pick'
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
    dimension: {
      type: Number, // 0 plan, 1 keyword
      required: true
    },
    channel: {
      type: Number,
      default: 5
    },
    userId: {
      type: [Number, String]
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
  computed: {
    opts() {
      const {
        dimension,
        keywords,
        plans
      } = this

      if (dimension === 0) {
        return [
          ...plans.map(p => ({
            label: p.plan,
            value: 'p-' + p.id
          }))
        ]
      }

      if (dimension === 1) {
        return [
          ...keywords.map(k => ({
            label: k.keyword,
            value: 'k-' + k.id
          }))
        ]
      }

      return []
    }
  },
  methods: {
    clearValue() {
      if (this.multiple) {
        this.setValue([])
      } else {
        this.setValue('')
      }
    },
    setValue(v) {
      this.$emit('change', v)
      this.$emit('input', v)

      if (v === this.localValue) {
        return
      }

      this.localValue = v
    },
    async queryPlanAndKeyword() {
      const { channel, userId } = this
      const query = pick(this, 'channel', 'userId')

      const [
        keywords,
        plans
      ] = await Promise.all([
        getKeywords(query),
        getPlans(query)
      ])

      this.keywords = keywords
      this.plans = plans
    }
  },
  watch: {
    dimension(val, pre) {
      if (val !== pre) {
        this.clearValue()
      }
    },
    async channel(val) {
      this.clearValue()
      await this.queryPlanAndKeyword()
    },
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

  async mounted() {
    await this.queryPlanAndKeyword()
  }
}
</script>
