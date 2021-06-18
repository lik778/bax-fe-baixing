<template>
  <div class="bw-plus-plan-list">
    <header>管理计划</header>
    <main>
      <el-form :model="query"
               label-width="100px"
               label-position="left"
               class="search"
               @submit.native.prevent>
        <el-form-item label="关键词">
          <el-input v-model="query.keyword"
                    placeholder="输入关键词查询"
                    style="width: 300px;" />
        </el-form-item>
        <el-form-item label="投放状态">
          <el-checkbox-group v-model="query.promoteStatus">
            <el-checkbox :label="opt.value"
                         v-for="(opt, index) in promoteStatusOpts"
                         :key="index">{{opt.label}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="审批状态">
          <el-checkbox-group v-model="query.auditStatus">
            <el-checkbox :label="opt.value"
                         v-for="(opt, index) in auditStatusOpts"
                         :key="index">{{opt.label}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <el-table :data="promotes"
                class="table"
                style="width: 100%">
        <el-table-column prop="id"
                         label="推广ID">
        </el-table-column>
        <el-table-column label="关键词"></el-table-column>
        <el-table-column label="审核状态"></el-table-column>
        <el-table-column label="投放状态"></el-table-column>
        <el-table-column label="平台"></el-table-column>
        <el-table-column label="推广时段"></el-table-column>
        <el-table-column label="服务时长"></el-table-column>
        <el-table-column label="投放剩余天数"></el-table-column>
        <el-table-column label="操作">
          <div>
            <el-button type="text">查看计划</el-button>
            <el-button type="text">店铺</el-button>
            <el-button type="text">续费</el-button>
          </div>
        </el-table-column>
      </el-table>
    </main>
  </div>
</template>

<script>
import { promoteStatusOpts, auditStatusOpts } from 'constant/bw-plus'

export default {
  name: 'bw-plus-plan-list',
  data () {
    return {
      promoteStatusOpts,
      auditStatusOpts,

      query: {
        keyword: '',
        promoteStatus: [],
        auditStatus: []
      },
      promotes: []
    }
  }
}
</script>

<style lang="scss" scoped>
.bw-plus-plan-list {
  margin: 10px;
  background: #fff;
  padding: 0;
  > header {
    color: #666;
    border-bottom: 1px solid #e6e6e6;
    padding: 14px;
    font-size: 16px;
  }
  > main {
     padding: 30px 40px;
  }
}
</style>
