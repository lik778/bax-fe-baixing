<template>
  <h4 class="main">
    <el-checkbox :value="true" />
    <label>我已阅读并同意遵守</label>
    <a v-if="type === 'contract'"
      v-bind:href="assetHost + 'baixing-qwt-contract.docx'"
      download="百姓网全网通用户协议.docx">
      《百姓网全网通用户协议》
    </a>
    <a v-if="type === 'content-rule'"
      v-bind:href="assetHost + 'baixing-online-promotion-content-rule.docx'"
      download="百姓网站外推广填写准则.docx">
      《百姓网站外推广填写准则》
    </a>
  </h4>
</template>

<script>
import { assetHost } from 'config'
import {Checkbox as ElCheckbox} from 'element-ui'

export default {
  name: 'bax-qwt-contract-ack',
  components: {
    ElCheckbox,
  },
  props: {
    type: {
      // content-rule, contract
      type: String,
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

<style lang="postcss" scoped>

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

