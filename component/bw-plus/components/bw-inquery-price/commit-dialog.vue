<template>
    <el-dialog
          title="提交"
          :visible.sync="visible"
          width="30%"
        >
          <span>确认提交审核嘛？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" :loading="isPending" @click="submit">确 定</el-button>
          </span>
    </el-dialog>
</template>
<script>
export default {
  name: 'commit-dialog',
  props: {
    visible: {
      type: Boolean,
      default: false,
      require: true
    },
    isPending: {
      type: Boolean,
      default: false,
      require: true
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    submit () {
      this.$emit('submit')
    }
  }
}
</script>
