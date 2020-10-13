<template>
  <div>
    <!-- 列表 -->
    <el-table class="query-table" border :data="queryList">
      <el-table-column label="创建时间" prop="createTime" width="120" :formatter="dateFormatter" />
      <el-table-column label="核心词" prop="word" width="120" />
      <el-table-column label="优选词" prop="preferredWords" />
      <el-table-column label="操作" align="center" width="180">
        <template>
          <el-button type="text" size="small" :disabled="true">假装有个按钮</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="pagniation"
      layout="prev, pager, next"
      :total="pagination.total"
      :page-size="pagination.size"
      :current-page="pagination.current"
      @current-change="getQueryListWithTip"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { formatReqQuery } from 'util'

const fetchQueryList = async function () {
  const data = Array.apply(null, { length: 15 }).map((x,i) => ({
    createTime: Math.floor(+new Date() / 1000),
    id: i,
    word: '核心词',
    preferredWords: ['测试优选词','测试优选词','测试优选词','测试优选词','测试优选词'],
  }))
  return await {
    data,
    total: data.length * 5
  }
}

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
    }
  },
  mounted() {
    this.getQueryList()
  },
  methods: {

    async getQueryListWithTip(...args) {
      await this.getQueryList(...args)
      if (this.queryList) {
        this.$message({
          message: '数据获取成功',
          type: 'success'
        })
      }
    },
    async getQueryList(page = 0) {
      const query = {
        ...formatReqQuery(this.query, {
          // date: val => val && +new Date(this.query.date)
        }),
        page,
      }
      const { data, total } = (await fetchQueryList(query)) || {}
      this.queryList = data.map(x => x)
      this.pagination = {
        ...this.pagination,
        current: page,
        total,
      }
    },

    /*********************************************************** calculation */

    dateFormatter({createTime}) {
      return dayjs(createTime * 1000).format('YYYY-MM-DD')
    },

  },
}
</script>

<style lang="postcss" scoped>
.pagniation {
  margin-top: 1em;
}
</style>
