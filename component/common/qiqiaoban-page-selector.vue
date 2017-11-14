
<template>
  <bax-select
    class="qiqiaoban-page-selector"
    placeholder="请选择投放官网"
    :disabled="disabled"
    :value="value"
    :options="options"
    @change="onChange">
  </bax-select>
</template>

<script>
  import BaxSelect from './select'
  import { getQiqiaobanPageList } from 'api/fengming'

  export default {
    name: 'qiqiaoban-page-selector',
    components: {
      BaxSelect
    },
    props: {
      value: {
        type: String
      },
      disabled: {
        type: Boolean
      }
    },
    data() {
      return {
        options: []
      }
    },
    methods: {
      onChange(v) {
        this.$emit('change', v)
        this.$emit('input', v)
      }
    },
    async mounted() {
      const pageList = await getQiqiaobanPageList()
      this.options = pageList.map(p => ({
        label: p.name,
        value: p.url
      }))
    }
  }
</script>

<style scoped>
  .qiqiaoban-page-selector {
    width: 560px;
  }
</style>
