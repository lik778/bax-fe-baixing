<template>
    <el-dialog
      title="提示"
      :visible.sync="dialogContent.visible"
      @close="cancel"
      width="30%"
    >
      <div>
        <p>{{dialogContent.text}}</p>
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="请选择计划：">
            <el-select @change="campaignIdChange" v-model="form.campaignId" placeholder="请选择">
              <el-option
                v-for="item in campaignIds"
                :key="item.value"
                :label="item.label"
                :disabled="item.value === 0"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.campaignId" label="请选择单元：">
            <el-select v-model="form.groupId" placeholder="请选择">
              <el-option
                v-for="item in groupIds"
                :key="item.value"
                :label="item.label"
                :disabled="item.value === 0"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save" :loading="savePendding">保 存</el-button>
      </span>
    </el-dialog>
</template>
<script>
import { getCampaignIds, getGroupIds } from 'api/fengming-campaign'
export default {
  name: 'move-copy-com',
  props: {
    dialogContent: {
      type: Object,
      default: () => {},
      require: true
    }
  },
  data () {
    return {
      savePendding: false,
      campaignIds: [],
      groupIds: [],
      form: {
        campaignId: '',
        groupId: ''
      }
    }
  },
  async mounted () {
    const { query: { user_id: userId } } = this.$route
    const result = await getCampaignIds({ userId, is_online: 1 })
    this.campaignIds = result
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    async save () {
      this.savePendding = true
      await this.$emit('save', this.form)
      this.savePendding = false
    },
    async campaignIdChange () {
      const { query: { user_id: userId } } = this.$route
      const { campaignId } = this.form
      const result = await getGroupIds({ userId, campaignId, is_online: 1 })
      this.form.groupId = result[1] ? result[1].value : ''
      this.groupIds = result
    }
  }
}
</script>
