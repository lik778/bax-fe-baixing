<template>
  <div class="consume">
    <section-header>消耗查询</section-header>
    <content>
      <div>
        <el-date-picker type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          range-separator="-" />
      </div>
      <el-table :data="consumeLogs">
        <el-table-column label="日期" prop="id" />
        <el-table-column label="计划" prop="id" />
        <el-table-column label="类型" prop="id" />
        <el-table-column label="消费金额" prop="id" />
      </el-table>
      <bax-pagination :options="consumeQuery"
        @current-change="onCurrentChange">
      </bax-pagination>
    </content>
  </div>
</template>

<script>
import SectionHeader from 'com/common/section-header'
import BaxPagination from 'com/common/pagination'

import store from './store'

export default {
  name: 'qwt-account-consume',
  components: {
    SectionHeader,
    BaxPagination
  },
  fromMobx: {
    consumeQuery: () => store.consumeQuery,
    consumeLogs: () => store.consumeLogs
  },
  methods: {
    async onCurrentChange() {

    }
  }
}
</script>

<style scoped>
.consume {
  & > content {
    & > div {
      margin-bottom: 15px;
    }
  }
}
</style>
