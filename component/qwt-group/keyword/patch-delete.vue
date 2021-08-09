<template>
    <el-dialog
        title="提示"
        :visible.sync="patchDeleteContent.visible"
        width="30%"
        @close="cancel">
        <span v-if="patchDeleteContent.type === 'delete'">将对选中的关键词做删除操作，请确认：</span>
        <div v-if="patchDeleteContent.type === 'change'">
            <p>将对选中的关键词统一调整出价，请设置出价：</p>
            <el-input v-model="price" placeholder="请输入内容"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
  name: 'patch-delete',
  props: {
    patchDeleteContent: {
      type: Object,
      default: () => {},
      require: true
    }
  },
  data () {
    return {
      price: ''
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    confirm () {
      if (this.patchDeleteContent.type === 'delete') {
        this.$emit('deleteHandle')
      } else {
        this.$emit('changePrice', this.price)
      }
    }
  }
}
</script>
