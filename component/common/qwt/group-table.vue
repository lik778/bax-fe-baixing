<template>
  <el-table class="group-table"
            :data="groupData"
            border>
    <el-table-column prop="name"
                     label="单元名称"
                     align="center" />
    <!-- <el-table-column prop="campaignId" label="所属计划" align="center" /> -->
    <!-- <el-table-column prop="source" label="渠道" align="center" /> -->
    <!-- TODO: 投放状态需要枚举，并为不一样的状态添加不一样的颜色，见设计稿 -->
    <el-table-column prop="status"
                     label="投放状态"
                     align="center">
      <template slot-scope="{row}">{{ row.status }}</template>
    </el-table-column>
    <!-- TODO: 见设计稿 -->
    <el-table-column prop="avg"
                     label="关键词平均排名"
                     align="center" />
    <el-table-column label="操作"
                     align="center">
      <template slot-scope="{row}">
        <span class="btn"
              @click="pauseGroup(row)">暂停</span>
        <span class="btn"
              @click="optimizeGroup(row)">优化</span>
        <span class="btn"
              @click="copyGroup(row)">复制</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  funtional: true,
  name: 'qwt-promotion-group-table',
  props: {
    displayColumns: {
      type: Array,
      required: false,
      default: () => {
        return ['name', 'campaignId', 'source', 'status', 'semStatus', 'avg']
      }
    },
    groupData: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    }
  },
  methods: {
    pauseGroup (group) {
      this.$alert('确定暂停投放？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(res => {
        // TODO 打接口暂停投放，
        // this.$emit事件发送
      }).catch(err => {
        console.error(err)
      })
    },
    optimizeGroup (group) {
      this.$router.push({ name: 'qwt-update-group', params: { id: group.campaignId } })
    },
    copyGroup (group) {
      // TODO: 调用接口，生成单元信息,返回单元id
      const id = 0
      this.$route.push({ name: 'qwt-update-group', params: { id } })
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
  }
}
</style>
