<template>
  <div class="page">
    <!-- Header -->
    <header>
      优选词列表
      <div class="actions">
        <el-button type="text" @click="() => $router.go(-1)" style="padding: 0">返回查词列表</el-button>
      </div>
    </header>
    <!-- 展示 ABCD 词 -->
    <div class="keywords-container">
      <p class="header-info">
        <span class="description">提示：系统从 <span class="statics">{{wordAll}}</span>个词中为您优选出 <span class="statics">{{wordCounts}}</span> 个（包含双端）关键词，预估在180天内为您带来 <span class="statics">{{pvs}}</span> 展现。</span>
        <span class="actions">
          <el-button
            type="text"
            :icon="visible.abcd ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            @click="(visible.abcd = !visible.abcd)"
          >{{visible.abcd ? '收起填写历史' : '展开填写历史'}}</el-button>
        </span>
      </p>
      <transition name="fold-by-height">
        <div v-if="visible.abcd" class="view-container">
          <keyword-view
            v-for="(value, key) in keywordOptions"
            class="keyword-view"
            :key="key"
            :type="key"
            :title="value.title"
            :keywords="value.keywords"
            :isEdit="false"
          />
        </div>
      </transition>
    </div>

    <!-- 列表 -->
    <el-table
      class="query-table"
      v-loading="loading.query"
      border
      :data="queryList">
      <el-table-column label="创建时间" prop="createdTime" width="120" :formatter="({createdTime}) => $formatter.date(createdTime)" />
      <el-table-column label="核心产品" prop="coreWord" width="120" />
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
      @current-change="getQueryList"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import clone from 'clone'

import KeywordView from '../qc-create-promote/select-keywords/view'
import keywordOptions from '../qc-create-promote/select-keywords/keyword-options'

import { getRouteParam, formatReqQuery } from 'util'
import { getPromote, getPreferredWordsList, getPreferredWordsPV } from 'api/qianci'
import gStore from '../store'

export default {
  name: "qc-word-list",
  components: { KeywordView },
  fromMobx: {
    allQianciAreas: () => gStore.allQianciAreas
  },
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
      keywordOptions: clone(keywordOptions),
      promote: {},
      loading: {
        query: false
      },
      wordCounts: 0,
      pvs: 0,
      visible: {
        abcd: false,
      }
    }
  },
  computed: {
    wordAll() {
      const ALength = this.keywordOptions.A.keywords.length
      const BLength = this.keywordOptions.B.keywords.length
      const CLength = this.keywordOptions.C.keywords.length
      const DLength = this.keywordOptions.D.keywords.length
      return ALength * BLength + BLength * CLength + CLength * DLength + ALength * BLength * CLength
      + ALength * CLength * DLength + BLength * CLength * DLength + ALength * BLength * CLength * DLength
    }
  },
  async created() {
    this.id = getRouteParam.bind(this)('promoteId')
    if (!this.id) {
      throw new Error('No ID on qc-creative page.')
    } else {
      // 获取千词地区信息
      if (Object.keys(gStore.allQianciAreas).length === 0) {
        await gStore.getQianciAreas()
      }
      this.initPromote()
    }
  },
  mounted() {
    this.getPreferredWordPV()
    this.getQueryList()
    this.$on('hook:beforeDestroy', () => {
      // 清除前端分页存储的数据
      getPreferredWordsList.clear()
    })
  },
  methods: {

    async getPreferredWordPV() {
      const response = await getPreferredWordsPV({ id: this.id })
      const { expandedNum = 0, showNum = 0 } = response
      this.pvs = showNum
      this.wordCounts = expandedNum
    },
    async getQueryList(page = 1) {
      const query = {
        page: page - 1,
        size: this.pagination.size,
        id: this.id,
        ...formatReqQuery(this.query),
      }
      this.loading.query = true
      let response
      try {
        response = (await getPreferredWordsList(query)) || {}
        const { data } = response
        this.queryList = data.map(x => x)
      } finally {
        this.loading.query = false
      }
      const { total } = response
      this.pagination = {
        ...this.pagination,
        current: page,
        total,
      }
    },
    async initPromote() {
      this.promote = await getPromote(this.id)
      const {
        coreWord = '',
        provinces = [],
        prefixWords = [],
        suffixWords = []
      } = this.promote

      const{ enToCnMap, provinces: provincesStore } = this.allQianciAreas
      const areas = provinces.map(en => {
        const cnName = enToCnMap[en]
        return { name: cnName, en, checked: true, cities: provincesStore[cnName]  }
      })
      this.keywordOptions['A'].keywords = areas.reduce((t, c) => {
        t.push(c.name)
        return t.concat(c.cities)
      }, [])
      this.keywordOptions['B'].keywords = [...prefixWords]
      this.keywordOptions['C'].keywords = [coreWord]
      this.keywordOptions['D'].keywords = [...suffixWords]
    },
    handleSizeChange(size) {
      this.pagination.size = size
      this.getQueryList()
    },

  },
}
</script>

<style lang="postcss" scoped>
.actions {
  float: right;
}
.keywords-container {
  margin-top: 18px;
  padding: 16px;
  background: #f5f7fa;
  color: #6a778c;
  border-radius: 4px;

  & .description {
    color: #333;
  }

  & .header-info {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;

    & .el-button {
      flex-grow: 0;
    }
  }

  & .view-container {
    margin-top: 18px;
    display: flex;
    align-items: center;
    & > div:not(:last-child) {
        margin-right: 16px;
    }
  }
}
.query-table,
.pagniation {
  margin-top: 18px;
}

.keyword-view {
  border: 1px solid #ebeef5;
  width: 25%;
  background: white;

  & > .header {
    position: relative;
    text-align: center;
    height: 40px;
    line-height: 40px;

    & > i {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 10px;
      font-size: 22px;
      cursor: pointer;
    }
  }
  & > .content {
    height: 340px;
    padding: 10px 16px;
    border-top: 1px solid #ddd;
    line-height: 26px;
    overflow: auto;

    & > .empty {
      height: 100%;
      width: 90%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ccc;
      font-size: 13px;
    }
    & > .item {
      display: flex;
      align-items: center;
      justify-content: space-between;

      & > .word {
        flex: 1;
      }

      & i {
        font-size: 16px;
        margin-left: 10px;
        cursor: pointer;
        transition: all 0.2s linear;

        &:hover {
          transform: scale(1.2);
        }
      }
    }
  }
}
.fold-by-height-enter-active,
.fold-by-height-leave-active {
  transition: all .3s ease;
}
.fold-by-height-enter,
.fold-by-height-leave-to {
  transform: translateY(-15px);
  opacity: 0;
}
</style>
