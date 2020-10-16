<template>
  <div>
    <el-dialog :visible="visible"
               width="820px"
               :title="title"
               z-index="1000"
               @close="handleClose"
               custom-class="keyword-input-dialog"
               class="keyword-input">
      <div class="info"
           v-html="info" />
      <div class="textarea-container">
        <el-input type="textarea"
                  @focus="() => displayPlaceholder = false"
                  @blur="() => displayPlaceholder = true"
                  class="textarea"
                  :rows="10"
                  v-model="words" />
        <div class="placeholder"
             v-if="!words && displayPlaceholder"
             v-html="placeholder" />
      </div>
      <div slot="footer"
           class="footer">
        <el-button type="default"
                   size="small"
                   @click="handleClear">清空</el-button>
        <el-button type="primary"
                   size="small"
                   @click="handleConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'KeywordInput',
  props: {
    type: {
      type: String,
      required: true,
      default: 'A'
    },
    visible: {
      type: Boolean,
      required: true,
      default: false
    },
    title: {
      type: String,
      required: true
    },
    info: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      words: '',
      displayPlaceholder: true
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleClear() {
      this.words = ''
      this.handleClose()
    },
    handleConfirm() {
      this.$emit('words', {
        words: this.words,
        type: this.type
      })
      this.handleClose()
      this.handleClear()
    }
  }
}
</script>

<style lang="postcss" scoped>
/deep/ .keyword-input-dialog {
& .el-dialog__body {
    padding: 0 20px;
  }
}
.textarea-container {
  position: relative;
  margin: 10px 0;
& > .placeholder {
    position: absolute;
    z-index: 0;
    top: 5px;
    left: 15px;
    font-size: 14px;
    color: #DCDFE6;
  }
}


</style>
