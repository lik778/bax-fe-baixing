<template>
  <h4 class="main">
    <el-checkbox :value="true"></el-checkbox>
    <label>我已阅读并同意遵守</label>
    <a v-bind:href="url"
      download="百姓网站外推广用户协议.docx">
      《百姓网站外推广用户协议》
    </a>
  </h4>
</template>

<script>
import { assetHost } from 'config'

export default {
  name: 'bax-qwt-contract-ack',
  data() {
    return {
      url: assetHost + 'baixing-qwt-promotion-contract.docx'
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

