<template>
  <el-dialog title="提示"
             :visible="visible"
             width="600px"
             class="negative-words-alone"
             :before-close="handleCancel"
             :close-on-press-escape="false"
             :close-on-click-modal="false">
  <div class="tip">请选择否词类型</div>
    <el-select v-model="selectValue" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
  </el-select>
  <span slot="footer" class="dialog-footer">
    <el-button @click="handleCancel">取 消</el-button>
    <el-button type="primary" @click="handleEnter">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'negative-word-alone',
  props: {
    visible: {
      type: Boolean,
      require: true
    }
  },
  data () {
    return {
      options: [{
        value: 'accurate',
        label: '精确否定'
      }, {
        value: 'phrase',
        label: '短语否定'
      }],
      selectValue: ''
    }
  },
  methods: {
    handleClose () {
    },
    handleCancel () {
      this.$emit('close')
    },
    handleEnter () {
      this.$emit('upWord', this.selectValue)
      this.handleCancel()
    }
  }
}
</script>

<style lang="scss" scoped>
  .negative-words-alone {
    .tip {
      font-size: 14px;
      margin-bottom: 20px;
      color: $c-tip;
    }
  }

</style>
