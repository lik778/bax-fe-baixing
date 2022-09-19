<template>
  <h4 class="main">
    <el-checkbox v-model="isAgreement" />
    <label @click="() =>isAgreement = !isAgreement">我已阅读并同意遵守</label>
    <a v-if="type === 'contract'"
      v-bind:href="assetHost + 'baixing-sst-contract-2020-v2.pdf'"
      download="百姓网搜索通服务协议.pdf">
      《百姓网搜索通服务协议》
    </a>
    <a v-if="type === 'content-rule'"
      v-bind:href="assetHost + 'baixing-online-promotion-content-rule.docx'"
      download="百姓网站外推广填写准则.docx">
      《百姓网站外推广填写准则》
    </a>
     <a v-if="type === 'website-contract'"
        download="百姓网精品官网入驻协议.docx"
      :href="assetHost + 'baixing-custom-website-contract.docx'">
      《百姓网精品官网入驻协议》
    </a>
     <a v-if="type === 'contract-yibaisou'"
        download="易白搜站外推广填写准则.docx"
      :href="assetHost + 'yibaisou-zhanwai-contract-2022-v1.pdf'">
      《易百搜站外推广填写准则》
    </a>
  </h4>
</template>

<script>
import { assetHost } from 'config'

export default {
  name: 'bax-qwt-contract-ack',
  props: {
    type: {
      // content-rule, contract
      type: String,
      default: 'contract'
    }
  },
  data () {
    return {
      assetHost,
      isAgreement: false
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
