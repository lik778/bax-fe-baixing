<template>
  <div class="bg page">
    <div class="white-bg">
      <header>拓词记录</header>
      <div class="content">
        <!-- 搜索表单 -->
        <el-form class="query-form" :inline="true" :model="query">
          <el-form-item label="核心词">
            <el-input v-model="query.keyword" placeholder="请输入核心词" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="query.status" placeholder="所有状态" clearable>
              <el-option
                v-for="(v, k) in CONST.WORD_OFFER_STATUS"
                :label="v"
                :value="k"
                :key="k"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="actions" label="">
            <el-button
              class="query-button"
              type="primary"
              @click="() => getQueryListWithTip()"
            >查询</el-button>
            <el-button
              class="reset-button"
              type="primary"
              plain
              @click="resetQuery"
            >重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 列表 -->
        <el-table class="query-table" border :data="queryList">
          <el-table-column label="查询日期" prop="createdAt" align="center" :formatter="dateFormatter" />
          <el-table-column label="核心词" prop="word" align="center" width="120" />
          <el-table-column label="城市" prop="cities" align="center">
            <template slot-scope="{row}">
              <el-tooltip
                popper-class="city-tooltip"
                class="item"
                effect="light"
                placement="top"
                :content="cityFormatter(row.cities, row.cities.length)" >
                  <span>{{cityFormatter(row.cities, 20)}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="status" align="center">
            <template slot-scope="{row}">
              <el-tooltip
                v-if="row.note"
                popper-class="city-tooltip"
                class="item"
                effect="light"
                placement="top"
                :content="row.note" >
                  <el-tag v-if="!row.isExpired" :type="MAP.statusToType[row.status]">
                    {{CONST.WORD_OFFER_STATUS[row.status]}}
                  </el-tag>
              </el-tooltip>
              <el-tag v-else :type="MAP.statusToType[row.status]">
                {{CONST.WORD_OFFER_STATUS[row.status]}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="() => checkoutPreferredWordLists(row)">查看</el-button>
              <el-button type="text" size="small" @click="() => goEditWordsPage(row)">修改</el-button>
              <el-button v-if="canPayForWords" type="text" size="small" :disabled="true">去抢购</el-button>
            </template>
          </el-table-column>
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
    </div>

    <el-dialog
      width="70%"
      :title="preferredWordsTableTitle"
      :visible="visible.preferredWordsTable"
      @close="visible.preferredWordsTable = false"
    ><preferred-words-table /></el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'

import PreferredWordsTable from './preferred-words-table'

import { formatReqQuery, getCnName } from 'util'

const fetchQueryList = async function () {
  const data = Array.apply(null, { length: 15 }).map((x,i) => ({
    createdAt: Math.floor(+new Date() / 1000),
    id: i,
    word: '核心词',
    cities: ['上海','北京','杭州','深圳'],
    status: 1,
    note: '关键词违规，请修改后尝试'
  }))
  return await {
    data,
    total: data.length * 5
  }
}

/* 查词状态 */
const WORD_OFFERED = 2
const WORD_UNOFFERED = 1
const WORD_OFFER_STATUS = {
  [WORD_UNOFFERED]: '未报价',
  [WORD_OFFERED]: '已报价'
}

export default {
  name: "qc-word-list",
  props: {
    allAreas: Array
  },
  data() {
    return {
      CONST: {
        WORD_OFFERED,
        WORD_UNOFFERED,
        WORD_OFFER_STATUS,
      },
      MAP: {
        statusToType: {
          [WORD_UNOFFERED]: 'warning',
          [WORD_OFFERED]: 'success'
        }
      },
      query: {
        keyword: '',
        status: '',
        date: '',
      },
      pagination: {
        current: 0,
        total: 0,
        size: 20,
        sizes: [10, 20, 50, 100],
      },
      queryList: [],
      visible: {
        preferredWordsTable: false,
      },
      active: {
        selectedItem: null,
      },
      store: {
        saleId: null,
        userId: null,
      }
    }
  },
  computed: {
    preferredWordsTableTitle() {
      const name = this.active.selectedItem && this.active.selectedItem.word
      return name && `“${name}”的优选词`
    },
    canPayForWords() {
      return this.store.saleId && this.store.userId
    }
  },
  created() {
    const query = parseQuery(window.location.search)
    const { saleId, userId } = query
    this.store = { saleId, userId }
  },
  mounted() {
    this.getQueryList()
  },
  methods: {
    handleSizeChange(size) {
      this.pagination.size = size
      this.getQueryListWithTip()
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
    async getQueryList(page = 0) {
      const query = {
        size: this.pagination.size,
        page,
        ...formatReqQuery(this.query, {
          // date: val => val && +new Date(this.query.date)
        }),
      }
      const { data, total } = (await fetchQueryList(query)) || {}
      this.queryList = data.map(x => x)
      this.pagination = {
        ...this.pagination,
        current: page,
        total,
      }
    },

    /*********************************************************** ux */

    checkoutPreferredWordLists(item) {
      this.visible.preferredWordsTable = true
      this.active.selectedItem = item
    },
    resetQuery() {
      this.query = {
        keyword: '',
        status: '',
        date: '',
      }
    },
    goEditWordsPage(row) {
      console.log(row)
      this.$router.push({
        name: 'qc-query-price',
        params: {
          id: row.id
        }
      })
    },

    /*********************************************************** calculation */

    dateFormatter({createdAt}) {
      return dayjs(createdAt * 1000).format('YYYY-MM-DD HH:MM')
    },
    cityFormatter(cities , max = 20) {
      return cities.slice(0, max).map(city => getCnName(city, this.allAreas)).join('，') + (cities.length > max ? `等${cities.length}个城市` : '')
    },
  },
  components: {
    PreferredWordsTable
  }
}
</script>

<style lang="postcss" scoped>
.page {
  margin: 16px;
  &.bg {
    & > .white-bg {
      background-color: white;
    }
  }

  & header {
    color: #666;
    border-bottom: 1px solid #e6e6e6;
    padding: 16px;
    font-size: 16px;
  }

  & .content {
    padding: 16px;
  }

  & .query-table {
    margin-top: 16px;
  }

  & .pagniation {
    margin-top: 1em;
  }
}
.query-form {
  padding: 16px;
  background: #eff2f7;
  border-radius: 2px;

  & .el-form-item {
    margin-bottom: 0;
  }

  & .actions {
    /* display: block; */
    /* margin-bottom: 0; */

    & >>> .el-form-item__label {
      opacity: 0;
    }
  }
}
</style>
