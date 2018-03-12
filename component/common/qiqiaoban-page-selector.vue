
<template>
  <span>
    <bax-select v-if="options.length"
      class="qiqiaoban-page-selector"
      placeholder="请选择投放官网"
      :disabled="disabled"
      :value="value"
      :options="options"
      @change="onChange">
    </bax-select>
    <a v-else target="_blank"
      href="http://bax.baixing.com.cn/ka/main">
      还没官网？了解并创建！
    </a>
  </span>
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

  a, a:visited {
    margin-left: 20px;
    font-size: 14px;
    color: red;
    cursor: pointer;
  }
</style>
