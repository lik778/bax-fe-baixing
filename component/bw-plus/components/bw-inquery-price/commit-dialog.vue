<template>
    <el-dialog
          :title="industryAuditResult.skipManualAudit ? '您的关键词已确认，点击确认订单后请让提单员统一提单。' : '需要人工审核哦！最快5分钟！最晚24小时内～'"
          :visible.sync="visible"
          width="50%"
          @close="cancel"
        >
          <PreInfoConfirm :allAreas="allAreas" :preInfo="preInfo" :skipManualAudit="industryAuditResult.skipManualAudit"/>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" :loading="isPending" @click="submit">{{industryAuditResult.skipManualAudit ? '确认订单' : '提交并查看审核进度'}}</el-button>
          </span>
    </el-dialog>
</template>
<script>
import PreInfoConfirm from '../bw-price-records/pre-info-confirm.vue'
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
    },
    industryAuditResult: {
      type: Object,
      default: () => {},
      require: true
    },
    allAreas: {
      type: Array,
      default: () => [],
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
