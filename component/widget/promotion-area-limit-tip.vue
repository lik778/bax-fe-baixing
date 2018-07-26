
<template>
  <div v-if="disAllowDesc"
    v-bind:style="{ marginLeft: page === 'charge' ? '5px' : '90px' }">
    {{ disAllowDesc }}
  </div>
</template>

<script>
import {
  getDisAllowAreasDesc
} from 'util/meta'

export default {
  name: 'bax-promotion-area-limit-tip',
  props: {
    selectedAreas: {
      type: Array,
      default: () => []
    },
    allAreas: {
      type: Array,
      required: true
    },
    page: {
      type: String
    }
  },
  computed: {
    disAllowDesc() {
      if (this.selectedAreas && this.selectedAreas.length) {
        return ''
      }

      return getDisAllowAreasDesc(this.allAreas)
    }
  }
}
</script>

<style lang="postcss" scoped>
div {
  margin-bottom: 10px;
  font-size: 12px;
  color: #ff1f0e;
}
</style>
