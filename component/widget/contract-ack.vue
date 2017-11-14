<template>
  <h4 class="main">
    <el-checkbox :value="true"></el-checkbox>
    <label>我已阅读并同意遵守</label>
    <a v-if="type === 'contract'"
      v-bind:href="assetHost + 'baixing-qwt-promotion-contract.docx'"
      download="百姓网站外推广用户协议.docx">
      《百姓网站外推广用户协议》
    </a>
    <a v-if="type === 'content-rule'"
      v-bind:href="assetHost + 'baixing-qwt-promotion-content-rule.docx'"
      download="百姓网站外推广内容准则.docx">
      《百姓网站外推广填写准则》
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
      type: 'string',
      default: 'contract'
    }
  },
  data() {
    return {
      assetHost
    }
  }
}
</script>

<style scoped>

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

