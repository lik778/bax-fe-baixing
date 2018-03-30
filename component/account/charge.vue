<template>
  <div class="charge">
    <section-header>充值查询</section-header>
    <content>
      <div>
        <el-date-picker type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          range-separator="-" />
      </div>
      <el-table :data="chargeLogs">
        <el-table-column label="日期" prop="id" />
        <el-table-column label="充值金额" prop="id" />
      </el-table>
      <bax-pagination :options="chargeQuery"
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
  name: 'qwt-account-charge',
  components: {
    SectionHeader,
    BaxPagination
  },
  fromMobx: {
    chargeQuery: () => store.chargeQuery,
    chargeLogs: () => store.chargeLogs
  },
  methods: {
    async onCurrentChange() {

    }
  }
}
</script>

<style scoped>
.charge {
  & > content {
    & > div {
      margin-bottom: 15px;
    }
  }
}
</style>

