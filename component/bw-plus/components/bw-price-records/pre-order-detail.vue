<template>
    <el-dialog
    title="提单确认"
    :visible.sync="dialogVisible"
    width="40%"
    >
    <el-form ref="form" label-width="80px">
        <el-form-item label="关键词：">
            关键词
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="preOrder">确 定</el-button>
    </span>
    </el-dialog>
</template>
<script>
export default {
  name: 'pre-order-detail',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
      require: true
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    preOrder () {
      this.$emit('preOrder')
    }
  }
}
</script>
