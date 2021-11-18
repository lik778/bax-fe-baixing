<template>
    <el-dialog
          title="提交"
          :visible.sync="visible"
          width="30%"
        >
          <PreInfoConfirm :preInfo="preInfo"/>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" :loading="isPending" @click="submit">确 定</el-button>
          </span>
    </el-dialog>
</template>
<script>
import { PreInfoConfirm } from '../index'
export default {
  name: 'commit-dialog',
  components: {
    PreInfoConfirm
  },
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
    },
    preInfo: {
      type: Object,
      default: () => {},
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
