<template>
    <div>
        <el-table
            cell-class-name="bax-cell"
            :data="list"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            row-key="id"
            v-loading="loading"
        >
            <el-table-column prop="name" label="单元名称" align="center" />
            <el-table-column prop="campaignId" label="所属计划" align="center" />
            <el-table-column prop="source" label="渠道" align="center" :formatter="(row, column, cellValue) => semPlatformCn[cellValue]" />
            <el-table-column prop="frontGroupStatusDesc" label="状态" align="center">
                <template slot-scope="{ row }">
                  <span v-if="row.frontGroupStatus !== GROUP_STATUS_REJECT"
                  :class="GROUP_STATUSES[row.frontGroupStatus].type || 'warning'">
                    {{row.frontGroupStatusDesc}}
                  </span>
                  <el-tooltip v-else
                              placement="top-start"
                              :content="row.frontGroupStatusDetails">
                    <span :class="GROUP_STATUSES[row.frontGroupStatus].type || 'warning'">
                      {{row.frontGroupStatusDesc}}
                    </span>
                    <i class="el-icon-info danger" />
                  </el-tooltip>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="opt" label="优化项" align="center" :formatter="(row) => filterOptimization(row)"/> -->
            <el-table-column prop="avgCpcRanking" label="关键词平均排名" align="center" :formatter="(row) => parseFloat(row.avgCpcRanking).toFixed(2)" />
            <el-table-column
                prop=""
                label="操作"
                align="center"
                width="150"
              >
                <template slot-scope="{row}">
                  <el-popconfirm title="确定要暂停投放吗？" @confirm="pause(row)">
                    <el-button slot="reference" type="text">{{!row.pause ? `暂停` : '投放'}}</el-button>
                  </el-popconfirm>
                  <router-link :to="{
                      name: 'qwt-update-group',
                      params: { id: row.id },
                    }">优化</router-link>
                  <router-link :to="{
                    name: 'qwt-create-group',
                    query: { cloneId: row.id }
                  }">复制</router-link>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { semPlatformCn, GROUP_STATUS_REJECT } from 'constant/fengming'
import { filterOptimization, GROUP_STATUSES } from '../constant'
export default {
  name: 'group-table',
  props: {
    list: {
      type: Array,
      require: true,
      default: () => []
    },
    loading: {
      type: Boolean,
      require: true,
      default: false
    }
  },
  data () {
    return {
      filterOptimization,
      semPlatformCn,
      GROUP_STATUSES,
      GROUP_STATUS_REJECT
    }
  },
  methods: {
    pausePromote (id) {
      this.$emit('pause', id)
    },
    confirm ({ pause, id }) {
      if (pause) {
        this.$emit('active', id)
      } else {
        this.$emit('pause', id)
      }
    },
    fmtPrice (price) {
      return (price / 100).toFixed(2)
    }
  }
}
</script>
<style lang="scss" scoped>
.bax-cell {
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
  a {
    color: #35a5e4;
  }
  .el-button--text {
    color: #35a5e4;
  }
  .unit-wrapper {
    display: flex;
    align-items: center;
  }
  .unit-cell {
    width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    justify-content: flex-end;
  }
  .edite-wrapper {
    display: flex;
    align-items: center;
  }
  .redColor{
    color: red;
  }
}
</style>
