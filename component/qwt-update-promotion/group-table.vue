<template>
  <el-table class="group-table"
            :data="groupData"
            border>
    <el-table-column prop="name"
                     label="单元名称"
                     align="center" />
    <!-- TODO: 投放状态需要枚举，并为不一样的状态添加不一样的颜色，见设计稿 -->
    <el-table-column prop="status"
                     label="投放状态"
                     align="center">
      <template slot-scope="{row}">{{ row.status }}</template>
    </el-table-column>
    <!-- TODO: 见设计稿 -->
    <el-table-column prop="avgCpcRanking"
                     label="关键词平均排名"
                     align="center" />
    <el-table-column label="操作"
                     align="center">
      <template slot-scope="{row}">
        <!-- TODO: 待后端确认状态 -->
        <span :class="{btn: true, disabled: isSales }"
              v-if="true"
              @click="pauseGroup(row)">暂停</span>
        <span :class="{btn: true, disabled: isSales }"
              v-if="false"
              @click="activeGroup(row)">开启</span>
        <span class="btn"
              @click="optimizeGroup(row)">优化</span>
        <span :class="{btn: true, disabled: isSales }"
              @click="copyGroup(row)">复制</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getAllGroups, activeGroups, pauseGroups } from 'api/fengming'

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
      groupData: null
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
      // TODO 暂停之后更改投放状态, 待后端确认状态
      group.status = 2
    },
    async activeGroup (group) {
      await this.$alert('确定暂停投放？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      await activeGroups([group.id])
      // TODO 暂停之后更改投放状态，待后端确认状态
      group.status = 1
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
  .btn {
    color: $c-info;
    cursor: pointer;
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
</style>
