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
        <span class="description">提示：系统从
          <statics :loading="loading.pvs" :value="wordAll" /> 个词中为您优选出
          <statics :loading="loading.pvs" :value="wordCounts" /> 个（包含双端）关键词，预估在180天内为您带来
          <statics :loading="loading.pvs" :value="pvs" /> 展现。
        </span>
        <span class="actions">
          <el-button
            type="text"
            :icon="visible.abcd ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            @click="(visible.abcd = !visible.abcd)"
          >{{visible.abcd ? '收起填写历史' : '展开填写历史'}}</el-button>
        </span>
      </p>
      <transition name="fold-by-height">
        <el-tabs v-if="visible.abcd && keywordOptionsList.length"
                 v-model="activeCoreWord">
          <el-tab-pane :label="item.coreWord"
                       :name="item.coreWord"
                       v-for="item in keywordOptionsList"
                       :title="item.coreWord"
                       :key="item.coreWord"
                       class="view-container">
            <keyword-view v-for="(value, key) in item.keywordOptions"
                          class="keyword-view"
                          :key="key"
                          :type="key"
                          :title="value.title"
                          :keywords="value.keywords"
                          :isEdit="false" />
          </el-tab-pane>
        </el-tabs>
      </transition>
    </div>

    <!-- 列表 -->
    <div class="expanded-words-container">
      <div class="info">
        <div class="info-detail">
          <span>创建时间：{{$formatter.date(expandedInfo.createdTime * 1000)}}&nbsp;&nbsp;</span>
          <span>核心产品：{{expandedInfo.coreWords.join(',')}}</span>
        </div>
        <el-button class="download" type="primary" @click="download">一键导出</el-button>
      </div>
      <div class="list">
        <div class="item" v-for="(item, index) in expandedInfo.data" :key="index">
          <span class="item-inner">{{item}}</span>
        </div>
      </div>
    </div>

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
import { Parser } from 'json2csv'
import FileSaver from 'file-saver'

import Statics from '../common/statics'
import KeywordView from '../qc-create-promote/select-keywords/view'
import keywordOptions from '../qc-create-promote/select-keywords/keyword-options'

import { getRouteParam, formatReqQuery, parseQuery, qcWordAll } from 'util'
import { getPromote, getPreferredWordsList, getPreferredWordsPV, getPackageById } from 'api/qianci'
import gStore from '../store'

export default {
  name: 'qc-word-list',
  components: {
    KeywordView,
    Statics
  },
  fromMobx: {
    allQianciAreas: () => gStore.allQianciAreas
  },
  data () {
    return {
      id: null,
      pagination: {
        current: 1,
        total: 0,
        size: 60,
        sizes: [40, 60, 80, 100]
      },
      activeCoreWord: '',
      expandedInfo: {
        createdTime: '',
        coreWords: [],
        data: []
      },
      queryList: [],
      keywordOptionsList: [],
      promote: {},
      loading: {
        query: false,
        pvs: false
      },
      wordCounts: 0,
      pvs: 0,
      visible: {
        abcd: false
      },
      expandTypes: []
    }
  },
  computed: {
    wordAll () {
      const types = ['A', 'B', 'C', 'D']
      const res = this.keywordOptionsList.reduce((curr, { type, keywordOptions }) => {
        const lens = types.reduce((h, c) => {
          h[c] = keywordOptions[c].keywords.length
          return h
        }, {})
        return curr + qcWordAll(lens, this.expandTypes)
      }, 0)
      return res
    }
  },
  async created () {
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
  mounted () {
    this.getPreferredWordPV()
    this.getQueryList()
    this.$on('hook:beforeDestroy', () => {
      getPreferredWordsList.clear()
    })
  },
  methods: {
    async getPreferredWordPV () {
      this.loading.pvs = true
      let response = null
      try {
        response = await getPreferredWordsPV({ id: this.id })
      } finally {
        setTimeout(() => { this.loading.pvs = false }, 300)
      }
      const { expandedNum = 0, showNum = 0 } = response || {}
      this.pvs = showNum
      this.wordCounts = expandedNum
    },
    async getQueryList (page = 1) {
      const { user_id: targetUserId, sales_id: salesId } = parseQuery(window.location.search)
      const query = {
        targetUserId,
        salesId,
        page: page - 1,
        size: this.pagination.size,
        id: this.id,
        ...formatReqQuery(this.query)
      }
      this.loading.query = true
      let response
      try {
        response = (await getPreferredWordsList(query)) || {}
        Object.assign(this.expandedInfo, response)
      } finally {
        this.loading.query = false
      }
      const { total } = response
      this.pagination = {
        ...this.pagination,
        current: page,
        total
      }
    },
    async initPromote () {
      this.promote = await getPromote(this.id)
      const { coreWordInfos = [], provinces = [], skuId } = this.promote

      const { enToCnMap, provinces: provincesStore } = this.allQianciAreas
      const areas = provinces.map(en => {
        const cnName = enToCnMap[en]
        return { name: cnName, en, checked: true, cities: provincesStore[cnName] }
      })

      // 根据skuId获取组词策略, 兼容老计划给默认值
      const product = (await getPackageById(skuId)) || {
        expandTypes: ['BC', 'ABC', 'ACD', 'BCD', 'ABCD']
      }
      const expandTypes = (product.expandTypes || []).map(rule => rule.toUpperCase())
      this.expandTypes = expandTypes

      // 封装keywordOptionsList
      const keywordProvinces = areas.reduce((t, c) => {
        t.push(c.name)
        return t.concat(c.cities)
      }, [])

      this.keywordOptionsList = coreWordInfos.map(item => {
        return {
          ...item,
          provinces: keywordProvinces
        }
      }).reduce((currO, item) => {
        const options = clone(keywordOptions)
        const res = Object.entries(keywordOptions).reduce((currI, [type, option]) => {
          const keywords = item[option.keywordsAlias] || []
          Object.assign(options, {
            [type]: {
              ...option,
              keywords: [].concat(keywords)
            }
          })
          return options
        }, {})

        return currO.concat({
          coreWord: item.coreWord,
          keywordOptions: res
        })
      }, [])

      this.activeCoreWord = this.keywordOptionsList[0].coreWord
    },
    handleSizeChange (size) {
      this.pagination.size = size
      this.getQueryList()
    },
    download () {
      const { createdTime } = this.promote
      const coreWords = this.expandedInfo.coreWords.join(',')

      function washCSVList (list) {
        return list.map(item => {
          return {
            keyword: item
          }
        })
      }

      const { data: list } = getPreferredWordsList.getAll()
      const csvData = new Parser().parse(washCSVList(list))
      const filename = `优选词列表 - ${coreWords} - ${dayjs(createdTime * 1000).format('YYYY/MM/DD')}.csv`
      const blob = new Blob(['\uFEFF' + csvData], { type: 'text/csv;charset=utf-8;' })
      FileSaver.saveAs(blob, filename)
    }
  }
}
</script>

<style lang="scss" scoped>
$border-base: 1px solid #dbdbdb;

.actions {
  float: right;
}
.keywords-container {
  margin-top: 18px;
  padding: 16px;
  background: #f5f7fa;
  color: #6a778c;
  border-radius: 4px;
  font-size: 14px;

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
    display: flex;
    align-items: center;
    & > div:not(:last-child) {
        margin-right: 16px;
    }
  }
}

.expanded-words-container {
  margin-top: 18px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
  border-top: $border-base;
  border-left: $border-base;
  & > .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f2f2f2;
    padding: 10px 12px;
    border-bottom: $border-base;
    border-right: $border-base;
  }
  & > .list {
    display: flex;
    flex-wrap: wrap;
    & > .item {
      width: 25%;
      padding: 12px;
      line-height: 20px;
      border-bottom: $border-base;
      border-right: $border-base;
      & > .item-inner {
        display: -webkit-box;
        max-height: 40px;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

.pag-container {
  display: flex;
  align-items: center;
}

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
</style>
