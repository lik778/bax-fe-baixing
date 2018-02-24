<template>
  <main class="mvp-campaign-list">
    <el-table :data="campaigns" border>
      <el-table-column label="开关" width="80">
        <template scope="s">
          <el-switch :value="!s.row.pause"
            @change="toggleCampaignPause(s.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="计划ID" prop="id">
      </el-table-column>
      <el-table-column label="计划状态"
        :formatter="r => r.status">
      </el-table-column>
      <el-table-column label="渠道"
        :formatter="r => r.sources.join('，')">
      </el-table-column>
      <el-table-column label="终端"
        :formatter="r => r.devices.join('，')">
      </el-table-column>
      <el-table-column label="城市"
        :formatter="r => r.areas.join('，')">
      </el-table-column>
      <el-table-column label="最高点击单价" width="120">
      </el-table-column>
      <el-table-column label="今日预算">
      </el-table-column>
      <el-table-column label="今日消耗">
      </el-table-column>
      <el-table-column label="操作">
        <template scope="s">
          <router-link :to="{ name: 'mvp-update-campaign', params: { id: s.row.id } }">
            管理
          </router-link>
          <router-link :to="{ name: 'mvp-dashboard', query: { campaignId: s.row.id, source: 'mvp-campaign-list' } }">
            查看报表
          </router-link>
        </template>
      </el-table-column>
    </el-table>
  </main>
</template>

<script>
import store from './store'

export default {
  name: 'mvp-campaign-list',
  fromMobx: {
    campaigns: () => store.campaigns
  },
  methods: {
    async toggleCampaignPause(campaign) {
      const { pause } = campaign

      try {
        await this.$confirm(`确定${pause ? '开始' : '暂停'}投放 ?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
      } catch (err) {
        return
      }

      console.error('todo')
    }
  }
}
</script>

<style scoped>
.mvp-campaign-list {
  padding: 10px;
}
</style>
