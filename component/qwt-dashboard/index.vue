<template>
  <div>
    <el-tabs type="border-card" class="qwt-dashboard">
      <el-tab-pane label="推广数据来源">
        <summary-data :user-info="userInfo" :sales-info="salesInfo" />
      </el-tab-pane>
      <el-tab-pane label="访客来源分析">
        <visitor-data :user-info="userInfo" v-if="userInfo" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import track from 'util/track'
import SummaryData from './summary-data'
import VisitorData from './visitor-data'

export default {
  name: 'qwt-dashboard',
  props: {
    userInfo: Object,
    salesInfo: Object,
  },
  components: {
    SummaryData,
    VisitorData,
  },
  async mounted() {
    setTimeout(() => {
      const { userInfo } = this
      track({
        action: 'qwt-dashboard: enter page',
        baixingId: userInfo.baixingId,
        baxId: userInfo.id,
      })
    }, 1200)
  },
}
</script>
