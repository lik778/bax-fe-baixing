<template>
  <div>
    <el-button @click="handleGoGroup"
               type="primary"
               :disabled="disabled"
               class="add-group-btn">
      <i class="el-icon-plus" />新增单元
    </el-button>
    <el-table class="group-table"
              :data="groupData"
              border>
      <el-table-column prop="name"
                       label="单元名称"
                       align="center" />
      <el-table-column prop="frontGroupStatus"
                       label="单元状态"
                       align="center">
        <template slot-scope="{row}">
          <span v-if="row.frontGroupStatus !== GROUP_STATUS_REJECT"
                :class="GROUP_STATUSES[row.frontGroupStatus].type || 'warning'">
            {{row.frontGroupStatusDesc}}
          </span>
          <el-tooltip v-else
                      placement="top-start"
                      :content="row.frontCampaignStatusDetails">
            <span :class="GROUP_STATUSES[row.frontGroupStatus].type || 'warning'">
              {{row.frontGroupStatusDesc}}
            </span>
            <i class="el-icon-info danger" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="frontCampaignStatus"
                       label="计划状态"
                       align="center">
        <template slot-scope="{row}">
          <span :class="GROUP_STATUSES[row.frontCampaignStatus].type || 'warning'">
            {{row.frontCampaignStatusDesc}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="avgCpcRanking"
                       label="关键词平均排名"
                       align="center" />
      <el-table-column label="操作"
                       align="center">
        <template slot-scope="{row}">
          <el-button class="btn"
                     :disabled="isSales"
                     :class="{disabled: isSales}"
                     v-if="row.frontGroupStatus !== GROUP_STATUS_REJECT"
                     @click="pauseGroup(row)">暂停</el-button>
          <el-button class="btn"
                     :disabled="isSales"
                     :class="{disabled: isSales}"
                     v-else
                     @click="activeGroup(row)">开启</el-button>
          <el-button class="btn"
                     :class="{disabled: isSales}"
                     :disabled="isSales"
                     @click="optimizeGroup(row)">优化</el-button>
          <el-button class="btn"
                     :class="{disabled}"
                     :disabled="disabled"
                     @click="copyGroup(row)">复制</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAllGroups, activeGroups, pauseGroups } from 'api/fengming'
import { GROUP_MAX, CAMPAIGN_STATUSES, GROUP_STATUSES, GROUP_STATUS_REJECT, GROUP_STATUS_ONLINE } from 'constant/fengming'

export default {
  name: 'group-table',
  props: {
    campaignId: {
      type: [String, Number],
      required: true
    },
    isSales: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      groupData: null,

      GROUP_MAX,
      CAMPAIGN_STATUSES,
      GROUP_STATUSES,
      GROUP_STATUS_REJECT
    }
  },
  computed: {
    disabled () {
      return this.isSales || (this.groupData && this.groupData.length >= GROUP_MAX)
    }
  },
  async mounted () {
    // tip 单计划最多有10个单元，一次性获取所有
    const { data = [] } = await getAllGroups({
      campaignId: this.campaignId,
      offset: 0,
      limit: 100
    })
    this.groupData = data
  },
  methods: {
    async pauseGroup (group) {
      await this.$alert('确定暂停投放？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      await pauseGroups([group.id])
      group.frontGroupStatus = GROUP_STATUS_REJECT
    },
    async activeGroup (group) {
      await this.$alert('确定开启投放？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      await activeGroups([group.id])
      group.frontGroupStatus = GROUP_STATUS_ONLINE
    },
    optimizeGroup (group) {
      this.$router.push({
        name: 'qwt-update-group',
        params: { id: group.id }
      })
    },
    copyGroup (group) {
      this.$router.push({
        name: 'qwt-create-group',
        query: { cloneId: group.id }
      })
    },
    handleGoGroup () {
      this.$router.push({
        name: 'qwt-create-group',
        query: { campaignId: this.campaignId }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.group-table {
  .warning {
    color: $c-warning;
    font-size: 13px;
  }
  .success {
    color: $c-success;
    font-size: 13px;
  }
  .danger {
    color: $c-strong;
    font-size: 13px;
  }
  .btn {
    color: $c-info;
    cursor: pointer;
    padding: 0;
    border: 0;
    &:not(:first-child) {
      margin-left: 6px;
    }
    &.disabled {
      color: #c0c4cc;
      cursor: not-allowed;
      background-image: none;
      background-color: #fff;
      border-color: #ebeef5;
    }
  }
}

.add-group-btn {
  margin-bottom: 20px;
}
.el-icon-plus {
  margin-right: 4px;
}
</style>
