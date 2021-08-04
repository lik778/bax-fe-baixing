<template>
   <el-dialog
    title="复制单元"
    :visible.sync="dialogVisible"
    width="30%"
    @close="cancel"
    >
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="目标计划：" prop="promoteType">
                <el-radio-group v-model="ruleForm.promoteType">
                    <el-radio label="1">当前计划</el-radio>
                    <el-radio label="2">其他计划</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="ruleForm.promoteType == 2" prop="promoteId" label="选择一个计划：">
                <el-select v-model="ruleForm.promoteId" placeholder="请选择">
                    <el-option
                    v-for="item in promotionIds"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { getCampaignIds } from 'api/fengming-campaign'
export default {
  name: 'select-dialog',
  props: {
    dialogVisible: {
      type: Boolean
    }
  },
  data () {
    return {
      promoteId: '',
      ruleForm: {
        promoteType: '1',
        promoteId: ''
      },
      promotionIds: [],
      rules: {

      }
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    confirm () {
      this.$emit('copy', this.ruleForm)
    }
  },
  async mounted () {
    const { query: { user_id: userId } } = this.$route
    const isOnline = 1
    const result = await getCampaignIds({ userId, isOnline })
    this.promotionIds = result.splice(1, result.length)
  }
}
</script>
