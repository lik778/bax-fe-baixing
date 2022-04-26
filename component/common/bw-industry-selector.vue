<template>
  <div>
  <el-dialog
    title="反馈："
    :visible.sync="visible"
    width="40%"
    @close="handleClose"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    >
      <div class="dialog-contet">
        <p class="diglog-title">请选择您的行业名称</p>
        <el-input v-model="input"
                    maxlength="8"
                    minlength="2"
                    size="small"
                    class="search"
                    placeholder="请输入名称，限制2-8个汉字"></el-input>
        <p class="diaglog-tip">提示：提交后可先选择接近的行业创建物料，我们将逐步完善行业覆盖</p>
      </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'BwIndustrySelector',
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      input: ''
    }
  },
  methods: {
    handleClose () {
      this.input = ''
      this.$emit('close')
    },
    handleConfirm () {
      this.$emit('submit', this.input)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-contet {
    & .diglog-title {
      margin-bottom: 10px;
      }
      & .search {
        width: 300px;
      }
    & .diaglog-tip {
      margin-top: 10px;
      color: #ff7533;
      font-size: 12px;
    }
  }

</style>>
