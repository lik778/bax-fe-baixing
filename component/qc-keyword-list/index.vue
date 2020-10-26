<template>
  <div class="page">
    <header>优选词列表</header>
    <p class="header-info">
      <span class="description">提示：系统为您优选<span class="statics">{{wordCounts}}</span>个关键词（包含双端）。在 180 天内预计有 <span class="statics">{{pvs}}</span> 人看到您的广告，数据来源于历史。</span>
      <el-button type="primary" plain @click="() => $router.go(-1)">返回上一页</el-button>
    </p>
    <!-- 列表 -->
    <el-table
      class="query-table"
      v-loading="loading.query"
      border
      :data="queryList">
      <el-table-column label="创建时间" prop="createdTime" width="120" :formatter="({createdTime}) => $formatter.date(createdTime)" />
      <el-table-column label="核心词" prop="coreWord" width="120" />
      <el-table-column label="优选词" prop="expandedWord" />
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="pagniation"
      layout="total,sizes,prev,pager,next"
      :total="pagination.total"
      :page-size="pagination.size"
      :page-sizes="pagination.sizes"
      :current-page="pagination.current"
      @current-change="getQueryListWithTip"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs'

import { getRouteParam, formatReqQuery } from 'util'
import { getPreferredWordsList, getPreferredWordsPV } from 'api/qianci'

export default {
  name: "qc-word-list",
  data() {
    return {
      id: null,
      pagination: {
        current: 1,
        total: 0,
        size: 15,
        sizes: [10, 15, 30, 50],
      },
      queryList: [],
      loading: {
        query: false
      },
      wordCounts: 0,
      pvs: 0,
    }
  },
  created() {
    this.id = getRouteParam.bind(this)('promoteId')
  },
  mounted() {
    this.getQueryList()
    this.getPreferredWordPV()
  },
  methods: {

    async getPreferredWordPV() {
      const response = await getPreferredWordsPV()
      const { expandedNum: wordCounts = 0, showNum: pvs = 0 } = response
      this.pvs = pvs
      this.wordCounts = wordCounts
    },

    async getQueryListWithTip(...args) {
      await this.getQueryList(...args)
      if (this.queryList) {
        this.$message({
          message: '数据获取成功',
          type: 'success'
        })
      }
    },
    async getQueryList(page = 1) {
      const query = {
        page: page - 1,
        size: this.pagination.size,
        id: this.id,
        ...formatReqQuery(this.query),
      }
      this.loading.query = true
      const { data, total } = (await getPreferredWordsList(query)) || {}
      this.queryList = data.map(x => x)
      this.loading.query = false

      this.pagination = {
        ...this.pagination,
        current: page,
        total,
      }
    },
    handleSizeChange(size) {
      this.pagination.size = size
      this.getQueryListWithTip()
    },

  },
}
</script>

<style lang="postcss" scoped>
.description {
  margin: 32px 0;
  color: #666;
}
.header-info {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;

  & .el-button {
    flex-grow: 0;
  }
}
.pagniation {
  margin-top: 1em;
}
</style>
