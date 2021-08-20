<template>
  <div class="bw-plus-plan-list">
    <header>管理推广</header>
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
                         v-for="(value, key) in PACKEAGE_STATUS_MAP"
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
                :v-loading="loading"
                style="width: 100%">
        <el-table-column prop="id"
                         label="推广ID">
          <span slot-scope="{row}"
                class="promote-id"
                @click="goToPlanList(row.id)">{{row.id}}</span>
        </el-table-column>
        <el-table-column label="关键词"
                         show-overflow-tooltip
                         :formatter="r => $formatter.join(r.keywords, ',')" />
        <el-table-column label="审核状态">
          <div slot-scope="{row}"
               class="status-container">
            <status-show :dot-color="AUDIT_STATUS_COLOR_MAP[row.auditStatus]">
              <span>{{AUDIT_STATUS_MAP[row.auditStatus]}}</span>
            </status-show>
          </div>
        </el-table-column>
        <el-table-column label="投放状态">
          <div slot-scope="{row}"
               class="status-container">
            <status-show :dot-color="PROMOTE_STATUS_COLOR_MAP[row.status]">
              <span>{{PACKEAGE_STATUS_MAP[row.status]}}</span>
            </status-show>
          </div>
        </el-table-column>
        <el-table-column prop="cities" width="180" label="投放城市" >
          <template slot-scope="{ row }">
              <el-popover
                placement="right"
                width="500"
                trigger="hover">
                <ProvinceCityMap :allAreas="allAreas" :cities="row.cities"/>
                <span slot="reference">{{ citiesFormater(row).text }}</span>
              </el-popover>
          </template>
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
                       class="btn-text"
                       @click="goToPlanList(row.id)">查看计划</el-button>
            <el-button type="text"
                       class="btn-text"
                       :disabled="row.days < THIRTY_DAYS"
                       @click="goToShop">店铺</el-button>
          </div>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination layout="prev, pager, next, total"
                       :total="total"
                       :page-size="query.size"
                       @current-change="handleCurrentChange"
                       :current-page="query.page + 1">
        </el-pagination>
      </div>
    </main>
  </div>
</template>

<script>
import { getUserPackageList } from 'api/biaowang-plus'
import { ProvinceCityMap } from './components'
import {
  AUDIT_STATUS_MAP,
  PACKEAGE_STATUS_MAP,
  DEVICE,
  SCHEDULE_TYPE,
  SERVICE_DAYS,
  PROMOTE_STATUS_COLOR_MAP,
  AUDIT_STATUS_COLOR_MAP,
  THIRTY_DAYS
} from 'constant/bw-plus'
import { getCnName } from 'util'
import debounce from 'lodash.debounce'
import StatusShow from './components/statusShow.vue'
import { isPro } from 'config'

export default {
  name: 'bw-plus-package-list',
  props: {
    allAreas: {
      type: Array,
      required: true,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      AUDIT_STATUS_MAP,
      PACKEAGE_STATUS_MAP,
      PROMOTE_STATUS_COLOR_MAP,
      AUDIT_STATUS_COLOR_MAP,
      DEVICE,
      SCHEDULE_TYPE,
      SERVICE_DAYS,
      THIRTY_DAYS,

      query: {
        keyword: '',
        status: [],
        auditStatus: [],
        size: 10,
        page: 0
      },
      total: 0,
      promotes: [],
      loading: false
    }
  },
  methods: {
    handleCurrentChange (page) {
      this.query.page = page - 1
    },
    citiesFormater (row) {
      const { cities } = row
      const length = cities.length
      const detail = cities.map(city => getCnName(city, this.allAreas)).join('、')
      if (length >= 362) {
        return {
          text: '全国',
          detail
        }
      }
      return {
        text: `${getCnName(cities[0], this.allAreas)}等${length}个城市`,
        detail
      }
    },
    queryPackageList: debounce(async function (params) {
      try {
        this.loading = true
        const { items, total } = await getUserPackageList({
          ...params,
          ...this.query
        })
        this.total = total
        this.promotes = items
      } finally {
        this.loading = false
      }
    }, 300),
    goToPlanList (id) {
      this.$router.push({ name: 'bw-plus-plan-list', params: { id } })
    },
    goToShop () {
      const shopLink = isPro
        ? '//shop.baixing.com/management/'
        : '//shop-test.baixing.cn/management/'
      window.open(shopLink)
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
  },
  components: {
    StatusShow,
    ProvinceCityMap
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
  .btn-text {
    padding: 0;
  }
}
.pagination-container {
  display: flex;
  justify-content: center;
  margin: 20px;
}
</style>
