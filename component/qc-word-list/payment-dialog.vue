<template>
  <el-dialog
    title="提示"
    width="47%"
    :visible="value"
    @close="closeDialog">
    <!-- content -->
    <p class="content">核心词 <span class="keyword">“{{keyword}}”</span>，推广区域 <span class="area">“{{areas.join('、')}}”</span>的支付链接已生成。</p>
    <div class="links" style="margin-top: 2.5em">
      <div class="copy-area" @click="copyURL">
        <el-input
          class="payment-url-input"
          v-model="url"
          suffix-icon="el-icon-copy-document"
          readonly
        />
      </div>
    </div>
    <!-- footer -->
    <div slot="footer">
      <el-button type="primary" @click="jumpURL">前往付款</el-button>
      <el-button @click="closeDialog">复制并关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import copy from 'copy-to-clipboard'

export default {
  props: {
    value: Boolean,
    keyword: String,
    areas: Array,
    url: String
  },
  methods: {
    copyURL() {
      copy(this.link)
      this.$message({
        type: 'success',
        message: '已复制到剪贴板~'
      })
    },
    jumpURL() {
      window.open(this.link)
    },
    closeDialog() {
      this.copyURL()
      this.$emit('onClose')
    }
  }
}
</script>

<style lang="postcss" scoped>
.copy-area {
  cursor: pointer;
}
>>> .el-dialog__body {
  padding: 40px 45px;
}
>>> .el-dialog__footer {
  padding: 10px 40px 30px 40px;
}
</style>
