<template>
  <el-table class="group-table"
            cell-class-name="bax-cell"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            :data="groupData">
    <el-table-column prop="name"
                     v-if="showColumns.includes('name')"
                     label="单元名称"
                     align="center"
                     :show-overflow-tooltip="true" />
    <el-table-column prop="campaignId"
                     v-if="showColumns.includes('campaignId')"
                     label="所属计划"
                     align="center" />
    <el-table-column prop="source"
                     v-if="showColumns.includes('source')"
                     label="渠道"
                     align="center"
                     :formatter="(row, column, cellValue) => semPlatformCn[cellValue]" />
    <el-table-column prop="frontGroupStatus"
                     v-if="showColumns.includes('frontGroupStatus')"
                     label="单元状态"
                     align="center">
      <template slot-scope="{ row }">
        <span v-if="row.frontGroupStatus !== GROUP_STATUS_REJECT"
              :class="GROUP_STATUSES[row.frontGroupStatus].type || 'warning'">
          {{ row.frontGroupStatusDesc }}
        </span>
        <el-tooltip v-else
                    placement="top-start"
                    :content="row.frontCampaignStatusDetails">
          <span :class="GROUP_STATUSES[row.frontGroupStatus].type || 'warning'">
            {{ row.frontGroupStatusDesc }}
             <i class="el-icon-info danger" />
          </span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column prop="frontCampaignStatus"
                     v-if="showColumns.includes('frontCampaignStatus')"
                     label="计划状态"
                     align="center">
      <template slot-scope="{ row }">
        <span :class="CAMPAIGN_STATUSES[row.frontCampaignStatus].type || 'warning'">
          {{ row.frontCampaignStatusDesc }}
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="avgCpcRanking"
                     v-if="showColumns.includes('avgCpcRanking')"
                     label="关键词平均排名"
                     align="center" />
    <el-table-column label="操作"
                     align="center">
      <template slot-scope="{ row }">
        <el-button type="text"
                   :disabled="
                      isSales ||
                      row.frontCampaignStatus === CAMPAIGN_STATUS_OFFLINE ||
                      row.frontGroupStatus === GROUP_STATUS_OFFLINE
                     "
                   @click="toggleGroupStatus(row)">
          {{ !!row.pause ? "开启" : "暂停" }}
        </el-button>
        <el-button type="text"
                   :disabled="
                      isSales ||
                      row.frontCampaignStatus === CAMPAIGN_STATUS_OFFLINE
                    "
                   @click="optimizeGroup(row)">优化</el-button>
        <el-button type="text"
                   :disabled="
                      isSales ||
                      row.frontCampaignStatus === CAMPAIGN_STATUS_OFFLINE
                    "
                   @click="copyGroup(row)">复制</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { activeGroups, pauseGroups } from 'api/fengming'
import {
  GROUP_MAX,
  CAMPAIGN_STATUSES,
  GROUP_STATUSES,
  GROUP_STATUS_REJECT,
  CAMPAIGN_STATUS_OFFLINE,
  GROUP_STATUS_OFFLINE,
  semPlatformCn
} from 'constant/fengming'

export default {
  name: 'group-table',
  props: {
    showColumns: {
      type: Array,
      required: false,
      default () {
        return ['name', 'campaignId', 'source', 'frontGroupStatus', 'frontCampaignStatus', 'avgCpcRanking']
      }
    },
    loading: {
      type: Boolean,
      required: false,
      default: false
    },
    isSales: {
      type: Boolean,
      default: false
    },
    groupData: {
      tyep: Array,
      required: true,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      GROUP_MAX,
      CAMPAIGN_STATUSES,
      GROUP_STATUSES,
      GROUP_STATUS_REJECT,
      CAMPAIGN_STATUS_OFFLINE,
      GROUP_STATUS_OFFLINE,
      semPlatformCn
    }
  },
  methods: {
    async toggleGroupStatus (group) {
      const typeText = group.pause ? '开启' : '暂停'
      await this.$confirm(`确定${typeText}投放？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      if (group.pause === 1) {
        await activeGroups([group.id])
      } else {
        await pauseGroups([group.id])
      }
      this.$emit('update-group-data')
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
  .bax-cell {
    .el-button--text {
      color: $c-info;
      padding: 0;
      &.is-disabled {
        color: #c0c4cc;
      }
    }
  }
}
</style>
