<template>
  <el-tabs type="border-card" class="qwt-dashboard" v-model="activeTab">
    <el-tab-pane label="推广数据来源" name="report">
      <summary-data :user-info="userInfo" :sales-info="salesInfo" />
    </el-tab-pane>
    <el-tab-pane label="访客来源分析" name="visitor">
      <visitor-data :user-info="userInfo" v-if="activeTab === 'visitor'" />
    </el-tab-pane>
  </el-tabs>
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
  data () {
    return {
      activeTab: 'report'
    }
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
