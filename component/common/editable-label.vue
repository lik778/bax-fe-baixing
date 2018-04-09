<template>
  <div>
    <span v-if="mode === 'view'">
      <label style="min-width: 14px">{{ displayValue }}</label>
      <el-button type="text" @click="mode = 'edit'">
        修改
      </el-button>
    </span>
    <span v-else>
      <el-input size="mini" style="width: 60px"
        :value="localValue" @change="onChange" />
      <el-button size="mini" type="primary" @click="ok">
        确定
      </el-button>
    </span>
  </div>
</template>

<script>
import { commafy } from 'utils'
import track from 'util/track'

export default {
  name: 'bax-editable-label',
  props: {
    trackAction: {
      type: String,
      required: false
    },
    value: {
      type: [Number, String],
      required: true
    },
    type: {
      type: String,
      validator: v => v === 'price'
    }
  },
  data() {
    return {
      localValue: this.type === 'price'
        ? this.centToYuan(this.value)
        : this.value,
      mode: 'view' // edit
    }
  },
  computed: {
    displayValue() {
      return this.type === 'price'
        ? commafy(this.localValue) + '元'
        : this.localValue
    }
  },
  methods: {
    onChange(v) {
      this.localValue = v
    },
    centToYuan(n) {
      return (n / 100).toFixed(2)
    },
    ok() {
      const v = this.type === 'price'
        ? this.localValue * 100
        : this.localValue
      this.$emit('change', v)

      if (this.trackAction) {
        track({
          action: this.trackAction
        })
      }
    }
  },
  watch: {
    value(v) {
      this.mode = 'view'
      this.localValue = this.type === 'price'
        ? this.centToYuan(v)
        : v
    }
  }
}
</script>
