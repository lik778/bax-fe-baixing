<template>
  <h4 class="main">
    <el-checkbox :value="isAgreement" @change="handleClick"></el-checkbox>
    <label @click="handleClick">我已阅读并同意遵守</label>
    <a :href="href" :download="title+'.pdf'">《{{title}}》</a>
  </h4>
</template>

<script>
import { assetHost } from 'config'

export default {
  name: 'bax-contract',
  props: {
    href: {
      type: String,
      default: assetHost + 'yibaisou-sst-contract-2022-v1.pdf'
    },
    title: {
      type: String,
      default: '易百搜凤鸣产品协议'
    },
    isAgreement: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  methods: {
    handleClick () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  margin-top: 30px;
  font-size: 14px;
  font-weight: normal;

  & > label {
    color: #6a778c;
  }

  & > a {
    color: #0994ff;
    cursor: pointer;
  }
}
</style>
