<template>
  <div class="page">
    <header>优选词列表</header>
    <span class="description">提示：优选系统为您优选<span class="statics">{{wordCounts}}</span>个关键词（包含双端）。预估在 180 天内为您带来<span class="statics">{{pvs}}</span>展现。</span>
    <!-- 列表 -->
    <el-table class="query-table" border :data="queryList">
      <el-table-column label="创建时间" prop="createTime" width="120" :formatter="dateFormatter" />
      <el-table-column label="核心词" prop="word" width="120" />
      <el-table-column label="优选词" prop="preferredWords" />
      <!-- <el-table-column label="操作" align="center" width="180">
        <template>
          <el-button type="text" size="small" :disabled="true">假装有个按钮</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="pagniation"
      layout="total,sizes,prev,pager,next"
      :total="pagination.total"
      :page-size="pagination.size"
      :page-sizes="pagination.sizes"
      :current-page="pagination.current"
      @current-change="initQueryListWithTip"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { formatReqQuery } from 'util'

import { getPreferredWordsList, getPreferredWordsPV } from 'api/qianci'

export default {
  name: "qc-word-list",
  data() {
    return {
      pagination: {
        current: 0,
        total: 0,
        size: 20
      },
      queryList: [],
      wordCounts: null,
      pvs: null,
    }
  },
  mounted() {
    this.initQueryList()
    this.initPreferredWordPV()
  },
  methods: {

    async initPreferredWordPV() {
      const response = await getPreferredWordsPV()
      const { wordCounts, pvs } = response

      this.wordCounts = wordCounts
      this.pvs = pvs
    },

    async initQueryListWithTip(...args) {
      await this.initQueryList(...args)
      if (this.queryList) {
        this.$message({
          message: '数据获取成功',
          type: 'success'
        })
      }
    },
    async initQueryList(page = 0) {
      const query = {
        ...formatReqQuery(this.query, {
          // date: val => val && +new Date(this.query.date)
        }),
        page,
      }
      const { data, total } = (await getPreferredWordsList(query)) || {}
      this.queryList = data.map(x => x)
      this.pagination = {
        ...this.pagination,
        current: page,
        total,
      }
    },
    handleSizeChange(size) {
      this.pagination.size = size
      this.initQueryListWithTip()
    },

    /*********************************************************** calculation */

    dateFormatter({createTime}) {
      return dayjs(createTime * 1000).format('YYYY-MM-DD')
    },

  },
}
</script>

<style lang="postcss" scoped>
.description {
  margin: 32px 0;
  color: #666;
}
.pagniation {
  margin-top: 1em;
}
</style>
