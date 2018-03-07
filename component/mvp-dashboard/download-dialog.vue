<template>
  <el-dialog :title="title" :visible="visible"
    :close-on-click-modal="false"
    :show-close="false"
    :before-close="ok"
    width="760px">
    <main class="main">
      <el-progress v-if="downloading" :text-inside="true" :stroke-width="18"
        :percentage="percentage">
      </el-progress>
      <el-table v-else :data="reports">
        <el-table-column prop="date" label="生成时间" width="180"
          :formatter="fmtTime">
        </el-table-column>
        <el-table-column prop="status" label="状态" width="180"
          :formatter="fmtStatus">
        </el-table-column>
        <el-table-column label="下载地址">
          <template scope="s">
            <a class="link" :href="s.row.uri" download>{{ s.row.uri }}</a>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer slot="footer">
      <el-button type="primary" @click="ok">
        关闭
      </el-button>
    </footer>
  </el-dialog>
</template>

<script>
import {
  CSV_REPORT_GENERATING,
  csvReportStatus
} from 'constant/fengming-report'

import {
  getPreparedDownloads
} from 'api/fengming-campaign'

import {
  toHumanTime
} from 'utils'

export default {
  name: 'mvp-dashboard-download-dialog',
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      downloading: true,
      percentage: 0,
      reports: []
    }
  },
  computed: {
    title() {
      if (this.downloading) {
        return '报表生成中 ...'
      } else {
        return '报表生成完成'
      }
    }
  },
  methods: {
    async checkDownloads() {
      this.reports = await getPreparedDownloads()
      const reports = this.reports = this.reports.sort((a, b) => b.createdAt - a.createdAt)

      const ing = reports.find(d => d.status === CSV_REPORT_GENERATING)
      if (ing) {
        this.downloading = true
        setTimeout(async () => {
          await this.checkDownloads()
        }, 8 * 1000)
      } else {
        // done
        this.downloading = false
        this.percentage = 0
      }
    },
    fmtStatus(row) {
      return csvReportStatus[row.status]
    },
    fmtTime(row) {
      return toHumanTime(row.createdAt)
    },
    ok() {
      if (this.downloading) return
      this.$emit('ok')
    }
  },
  watch: {
    visible(now) {
      if (now) {
        this.downloading = true
        this.checkDownloads()
      }
    }
  },
  mounted() {
    setInterval(() => {
      this.percentage += (Math.random() * 10 | 0) % 4
      if (this.percentage > 90) {
        this.percentage = 90
      }
    }, 800)
  }
}
</script>

<style scoped>
@import 'cssbase/mixin';

.link {
  @mixin wordline;
  width: 400px;
}
</style>
