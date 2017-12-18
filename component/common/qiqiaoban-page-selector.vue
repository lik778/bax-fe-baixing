
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
  import {
    getQiqiaobanPageList
  } from 'api/fengming'
  import {
    baxUserLogin,
    getUserSites
  } from 'api/ka'

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
      await baxUserLogin()

      const [list1, list2] = await Promise.all([
        getQiqiaobanPageList(),
        getUserSites()
      ])

      this.options = [
        ...list2.map(p => ({
          label: p.name,
          value: 'http://' + p.domain + '.mvp.baixing.com'
        })),
        ...list1.map(p => ({
          label: p.name,
          value: p.url
        }))
      ]
    }
  }
</script>

<style scoped>
  .qiqiaoban-page-selector {
    width: 560px;
  }
</style>
