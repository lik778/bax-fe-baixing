
<template>
  <bax-select class="cashcow-page-selector"
    placeholder="请选择投放微站"
    :value="value"
    :options="options"
    @change="onChange">
  </bax-select>
</template>

<script>
  import BaxSelect from './select'
  import { getReleasePageList } from 'api/cashcow'

  export default {
    name: 'cashcow-page-selector',

    components: {
      BaxSelect
    },

    data() {
      return {
        options: []
      }
    },

    props: {
      value: {
        type: String
      }
    },

    methods: {
      onChange(v) {
        this.$emit('change', v)
        this.$emit('input', v)
      }
    },

    async mounted() {
      const pageList = await getReleasePageList()
      this.options = pageList.map(p => ({
        label: p.config.campaignName,
        value: `vp.baixing.com/${p.id}`
      }))
    }
  }
</script>


<style scoped>
  .cashcow-page-selector {
    width: 560px;
  }
</style>
