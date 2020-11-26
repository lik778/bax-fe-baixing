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
        <el-collapse v-if="visible.abcd && keywordOptionsList.length > 0" 
                     v-model="activeCoreWord">
          <el-collapse-item v-for="(item, index) in keywordOptionsList" :key="index" :title="'查看' + item.coreWord">
            <div class="view-container">
              <keyword-view
                v-for="(value, key) in item.keywordOptions"
                class="keyword-view"
                :key="key"
                :type="key"
                :title="value.title"
                :keywords="value.keywords"
                :isEdit="false"
              />
            </div>
          </el-collapse-item>
        </el-collapse>
      </transition>
    </div>

    <!-- 列表 -->
    <div class="expanded-words-container">
      <div class="info">
        <div class="info-detail">
          <span>创建时间：{{$formatter.date(expandedInfo.createdTime)}}&nbsp;&nbsp;</span>
          <span>核心产品：{{expandedInfo.coreWords.join(',')}}</span>
        </div>
         <el-button class="download" type="primary" @click="download" size="small">一键导出</el-button>
      </div>
      <div class="list">
        <div class="item" v-for="item in expandedInfo.data" :key="item">
          {{item}}
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
import { Parser }  from 'json2csv'
import FileSaver from 'file-saver'

import Statics from '../common/statics'
import KeywordView from '../qc-create-promote/select-keywords/view'
import keywordOptions from '../qc-create-promote/select-keywords/keyword-options'

import { getRouteParam, formatReqQuery, parseQuery, qcWordAll } from 'util'
import { getPromote, getPreferredWordsList, getPreferredWordsPV } from 'api/qianci'
import gStore from '../store'

export default {
  name: "qc-word-list",
  components: {
    KeywordView,
    Statics,
  },
  fromMobx: {
    allQianciAreas: () => gStore.allQianciAreas
  },
  data() {
    return {
      id: null,
      pagination: {
        current: 1,
        total: 0,
        size: 60,
        sizes: [40, 60, 80, 100],
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
        pvs: false,
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
      const types = ['A', 'B', 'C', 'D']
      const res = this.keywordOptionsList.reduce((curr, {type, keywordOptions}) => {
        const lens = types.reduce((h, c) => (h[c] = keywordOptions[c].keywords.length, h), {})
        return curr + qcWordAll(lens)
      }, 0)
      return res
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
      getPreferredWordsList.clear()
    })
  },
  methods: {
    async getPreferredWordPV() {
      this.loading.pvs = true
      let response = null
      try {
        response = await getPreferredWordsPV({ id: this.id })
      } finally {
        setTimeout(() => this.loading.pvs = false, 300)
      }
     
      let showNum = 0
      let expandedNum = 0
      response.forEach(item => {
        showNum += item.showNum
        expandedNum += item.expandedNum
      })
      this.pvs = showNum
      this.wordCounts = expandedNum
    },
    async getQueryList(page = 1) {
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
        const { data, createdTime, coreWords } = response
        Object.assign(this.expandedInfo, response)
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
      const { coreWordInfos = [], provinces = [] } = this.promote

      const{ enToCnMap, provinces: provincesStore } = this.allQianciAreas
      const areas = provinces.map(en => {
        const cnName = enToCnMap[en]
        return { name: cnName, en, checked: true, cities: provincesStore[cnName]  }
      })

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
        let res = Object.entries(keywordOptions).reduce((currI, [type, option]) => {
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
    },
    handleSizeChange(size) {
      this.pagination.size = size
      this.getQueryList()
    },
    download() {
      const { user_id: targetUserId, sales_id: salesId } = parseQuery(window.location.search)
      const { coreWord, createdTime } = this.promote

      function washCSVList(list) {
        return list.map(item => {
          return {
            name: item
          }
        })
      }

      const { data: list } = getPreferredWordsList.getAll()
      const csvData = new Parser().parse(washCSVList(list))
      const filename = `优选词列表 - ${coreWord} - ${dayjs(createdTime).format('YYYY/MM/DD')}.csv`
      const blob = new Blob(['\uFEFF' + csvData], { type: 'text/csv;charset=utf-8;' })
      FileSaver.saveAs(blob, filename)
    }
  },
}
</script>

<style lang="postcss" scoped>
@import "../../cssbase/var.css";

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
    margin-top: 18px;
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
  border-top: var(--border-base);
  border-left: var(--border-base);
  & > .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f2f2f2;
    padding: 10px 12px;
    border-bottom: var(--border-base);
    border-right: var(--border-base);
  }
  & > .list {
    display: flex;
    flex-wrap: wrap;
    & > .item {
      width: 25%;
      padding: 12px;
      line-height: 20px;
      border-bottom: var(--border-base);
      border-right: var(--border-base);
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
