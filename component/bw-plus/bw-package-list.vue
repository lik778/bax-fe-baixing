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
          <el-checkbox-group v-model="query.status">
            <el-checkbox :label="key"
                         v-for="(value, key) in PROMOTE_STATUS_MAP"
                         :key="key">{{value}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="审批状态">
          <el-checkbox-group v-model="query.auditStatus">
            <el-checkbox :label="key"
                         v-for="(value, key) in AUDIT_STATUS_MAP"
                         :key="value">{{value}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <el-table :data="promotes"
                class="table"
                style="width: 100%">
        <el-table-column prop="id"
                         label="推广ID">
          <span slot-scope="{row}"
                class="promote-id"
                @click="goToPlanList(row.id)">{{row.id}}</span>
        </el-table-column>
        <el-table-column label="关键词"
                         :formatter="r => $formatter.join(r.keywords, ',')" />
        <el-table-column label="审核状态">
          <div slot-scope="{row}"
               class="status-container">
            <span class="dot"></span>
            <span>{{AUDIT_STATUS_MAP[row.auditStatus]}}</span>
          </div>
        </el-table-column>
        <el-table-column label="投放状态">
          <div slot-scope="{row}"
               class="status-container">
            <span class="dot"></span>
            <span>{{PROMOTE_STATUS_MAP[row.status]}}</span>
          </div>
        </el-table-column>
        <el-table-column label="平台"
                         :formatter="r => DEVICE[r.device]" />
        <el-table-column label="推广时段"
                         :formatter="r => SCHEDULE_TYPE[r.scheduleType]" />
        <el-table-column label="服务时长"
                         :formatter="r => `${r.days}天`" />
        <el-table-column label="投放剩余天数"
                         :formatter="r => `${r.remainsDays || 0}天`" />
        <el-table-column label="操作"
                         width="160">
          <div slot-scope="{row}">
            <el-button type="text"
                       @click="goToPlanList(row.id)">查看计划</el-button>
            <el-button type="text"
                       @click="goToShop">店铺</el-button>
          </div>
        </el-table-column>
      </el-table>
      <el-pagination layout="prev, pager, next"
                     :total="totalPage"
                     :page-size="query.size"
                     @current-change="handleCurrentChange"
                     :current-page="query.page + 1">
      </el-pagination>
    </main>
  </div>
</template>

<script>
import { getUserPackageList } from 'api/biaowang-plus'
import { AUDIT_STATUS_MAP, PROMOTE_STATUS_MAP, DEVICE, SCHEDULE_TYPE, SERVICE_DAYS } from 'constant/bw-plus'
import debounce from 'lodash.debounce'

export default {
  name: 'bw-plus-package-list',
  data () {
    return {
      AUDIT_STATUS_MAP,
      PROMOTE_STATUS_MAP,
      DEVICE,
      SCHEDULE_TYPE,
      SERVICE_DAYS,

      query: {
        keyword: '',
        status: [],
        auditStatus: [],
        size: 10,
        page: 0
      },
      totalPage: 0,
      promotes: []
    }
  },
  methods: {
    handleCurrentChange (page) {
      this.query.page = page - 1
    },
    queryPackageList: debounce(async function (params) {
      const { items, total } = await getUserPackageList({
        ...params,
        ...this.query
      })
      this.totalPage = total
      this.promotes = items
    }, 300),
    goToPlanList (id) {
      this.$router.push({ name: 'bw-plus-plan-list', params: { id } })
    },
    goToShop () {
      // TODO: 店铺跳转地址
    }
  },
  watch: {
    query: {
      immediate: true,
      deep: true,
      handler () {
        this.queryPackageList()
      }
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
  .promote-id {
    color: $--color-primary;
    cursor: pointer;
  }
}
</style>
