<template>
  <el-dialog
    title="提示"
    width="47%"
    :visible="value"
    @close="closeDialog">
    <!-- content -->
    <p class="content">核心产品 <span class="keyword">“{{coreWords.join(',')}}”</span>，推广区域 <span class="area">“{{(provinces || []).join('、')}}”</span>的支付链接已生成。</p>
    <div class="links" style="margin-top: 2.5em">
      <div class="copy-area">
        <el-input
          class="payment-url-input"
          v-model="url"
          readonly>
          <Clipboard
            class="payment-url-input-icon"
            slot="suffix"
            :content="url"
          />
        </el-input>
      </div>
    </div>
    <!-- footer -->
    <div slot="footer">
      <el-button @click="closeDialog">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Clipboard from 'com/widget/clipboard'

export default {
  props: {
    value: Boolean,
    coreWords: Array,
    provinces: Array,
    url: String
  },
  components: {
    Clipboard
  },
  methods: {
    closeDialog() {
      this.$emit('onClose')
    }
  }
}
</script>

<style lang="scss" scoped>
.copy-area {
  cursor: pointer;
}
.payment-url-input-icon {
  height: 40px;
  line-height: 40px;
}
/deep/ .el-dialog__body {
  padding: 40px 45px;
}
/deep/ .el-dialog__footer {
  padding: 10px 40px 30px 40px;
}
</style>
