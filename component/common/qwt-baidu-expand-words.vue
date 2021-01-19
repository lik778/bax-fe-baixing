<template>
  <el-dialog
    title="规划师拓词工具"
    width="70%"
    :append-to-body="true"
    :visible="visible"
    :show-close="true"
    :close-on-click-modal="false"
    :before-close="closeModal">
    <!-- confirm -->
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </span>
    <!-- query form -->
    <el-form :model="queryForm" :rules="rules" ref="queryForm" :inline="true" @submit.native.prevent>
      <el-form-item>
        <el-input
          class="search-input"
          v-model="queryForm.word"
          placeholder="请输入关键词查询"
          suffix-icon="el-icon-search"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="mini"
          :loading="loading.query"
          @keyup.enter="query"
          @click="query"
        >搜索</el-button>
      </el-form-item>
    </el-form>
    <!-- table -->
    <el-table
      v-loading="loading.query"
      ref="table"
      class="query-table"
      height="360"
      :border="true"
      :data="tableData"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="48" />
      <el-table-column label="关键词" prop="keyword" />
      <el-table-column label="流量特点" prop="show_reasons" />
      <el-table-column
        label="指导价（元）"
        sortable="custom"
        width="130"
        align="center"
        prop="price"
        :formatter="({price})=>$formatter.f2y(price)"
      />
      <el-table-column label="预估月均展现" sortable="custom" width="130" align="center" prop="pv" />
      <el-table-column label="预估月均点击" sortable="custom" width="130" align="center" prop="click" />
      <el-table-column label="激烈竞争程度" prop="competition" width="115" align="center" />
    </el-table>
    <!-- pagination -->
    <el-pagination
      class="pagniation"
      layout="prev,pager,next"
      :total="pagination.total"
      :page-size="pagination.size"
      :current-page="pagination.current"
      @current-change="getQueryList"
    />
    <!-- selected words -->
    <h4 v-if="selectedWords.length">已选关键词</h4>
    <div class="select-words-con">
      <template v-for="item in selectedWords">
        <transition name="el-fade-out" :key="item.id || item.keyword">
          <div
            class="selected-word-tag text"
            type="success"
            closable>
            {{ item.keyword }}
            <i class="el-icon-close" @click="deleteWord(item)" />
          </div>
        </transition>
      </template>
    </div>
  </el-dialog>
</template>

<script>
import { queryBaiduExpandWords } from 'api/fengming'

import { formatReqQuery } from 'util'
import track from 'util/track'

import gStore from '../store'

export default {
  props: {
    visible: Boolean,
    extraQuery: {
      type: Object,
      default: () => {}
    }
  },
  fromMobx: {
    currentUser: () => gStore.currentUser
  },
  data () {
    return {
      queryForm: {
        word: ''
      },
      rules: {
        word: [{ required: true, trigger: 'blur', message: '请填写关键词' }]
      },
      tableData: [],
      selectedWords: [],
      sortConfig: {
        prop: '',
        order: ''
      },
      pagination: {
        current: 1,
        total: 0,
        size: 15
      },
      loading: {
        query: false
      },
      selection: [],
      currentSelection: [],
      lock: {
        selection: false
      }
    }
  },
  computed: {
    toEmitValue () {
      return [...this.selectedWords.map(x => x)]
    }
  },
  beforeDestroy () {
    queryBaiduExpandWords.clear()
  },
  methods: {

    /* 页面逻辑 */

    validQueryWord () {
      const { word = '' } = this.queryForm
      if (!word) {
        this.$message.error('请填写查询关键词')
        return false
      }
      if (word.length > 32) {
        this.$message.error('关键词长度过长，请限制在 32 个字以内再重试')
        return false
      }
      return true
    },
    async query () {
      if (!this.validQueryWord()) return

      queryBaiduExpandWords.clear()
      this.sortConfig = {}
      this.clearSelection()
      await this.getQueryList()

      track({
        action: 'click-button: search-baidu-keywords',
        baixingId: this.currentUser.baixingId,
        baxId: this.currentUser.id,
        time: Date.now() / 1000 | 0,
        searchWord: this.queryForm.word
      })
    },
    async getQueryList (page = 1) {
      this.loading.query = true
      this.lock.selection = true
      const query = {
        page: page - 1,
        size: this.pagination.size,
        id: this.id,
        ...formatReqQuery(this.sortConfig),
        ...formatReqQuery(this.queryForm),
        ...formatReqQuery(this.extraQuery)
      }
      try {
        const { data = [], total } = await queryBaiduExpandWords({ ...query })
        this.tableData = data
        this.pagination = {
          ...this.pagination,
          current: page,
          total
        }
        if (this.tableData.length === 0) {
          this.$message.info('搜索结果为空')
        }
      } catch (error) {
        // return this.$message.error('网络错误，请稍后重试')
      } finally {
        this.loading.query = false

        // 翻页后保留多选
        this.$nextTick(() => {
          while (this.currentSelection.length) this.currentSelection.pop()
          const has = this.tableData.filter(x => this.selection.find(y => this.isSameKeyword(x, y)))
          this.maintainSelection(this.currentSelection, has)
          has.map(x => this.$refs.table.toggleRowSelection(x))
          this.lock.selection = false
        })
      }
    },
    selectWord (item) {
      const items = item instanceof Array ? [...item].reverse() : [item]
      while (items.length) {
        const cur = items.pop()
        if (!this.selectedWords.find(x => this.isSameKeyword(x, cur))) {
          this.selectedWords.push(cur)
        }
      }
    },
    unSelectWord (item) {
      const items = item instanceof Array ? [...item] : [item]
      while (items.length) {
        const cur = items.pop()
        const idx = this.selectedWords.findIndex(x => x === cur)
        if (idx !== -1) {
          this.selectedWords.splice(idx, 1)
        }
      }
    },
    deleteWord (item) {
      const currentPageItem = this.selection.find(x =>
        this.isSameKeyword(x, item) &&
        this.tableData.find(y => this.isSameKeyword(y, item))
      )
      // 如果在 Table 当前页找到相同项，
      // 那么直接调 ElementUI 触发 selection 变动的 API 就好，
      // 没找到的话，需要手动维护 selection 的变动
      if (currentPageItem) {
        this.$refs.table.toggleRowSelection(item)
      } else {
        this.maintainSelection(this.currentSelection, [], [item])
        this.maintainSelection(this.selection, [], [item])
      }
    },

    /* 页面交互 */

    closeModal () {
      this.$emit('update:visible', false)
    },
    handleSortChange (val) {
      const { prop, order } = val
      this.sortConfig = { prop, order }
      this.getQueryList()
    },
    handleConfirm () {
      this.$emit('confirm', this.toEmitValue)
      this.closeModal()
    },
    clearSelection () {
      this.lock.selection = true
      this.currentSelection.forEach(x => this.$refs.table.toggleRowSelection(x))
      this.lock.selection = false
      this.$nextTick(() => {
        this.selection = []
        this.currentSelection = []
      })
    },
    handleSelectionChange (vals) {
      if (!this.lock.selection) {
        const { add, del } = this.diffSelection(this.currentSelection, vals)
        this.maintainSelection(this.currentSelection, add, del)
        this.maintainSelection(this.selection, add, del)
      }
    },
    diffSelection (oldS, newS) {
      const same = this.isSameKeyword
      const add = newS.filter(x => !oldS.find(y => same(x, y)))
      const del = oldS.filter(x => !newS.find(y => same(x, y)))
      return { add, del }
    },
    maintainSelection (selection, add = [], del = []) {
      add = [...add]
      del = [...del]
      while (add.length) {
        const cur = add.pop()
        if (!selection.find(x => this.isSameKeyword(x, cur))) {
          selection.push(cur)
          this.selectWord(cur)
        }
      }
      while (del.length) {
        const cur = del.pop()
        const idx = selection.findIndex(x => this.isSameKeyword(x, cur))
        if (idx !== -1) {
          selection.splice(idx, 1)
          this.unSelectWord(cur)
        }
      }
    },

    /* 计算函数 */

    isSameKeyword (a, b) {
      const compareKeys = ['keyword']
      return compareKeys.every(k => a[k] === b[k])
    },

    isWordSelected (item) {
      return this.selectedWords.find(word => this.isSameKeyword(word, item))
    }
  }
}
</script>

<style lang="scss" scoped>
.search-input {
  width: 230px;
}
.table-actions {
  padding: 0 10px;
}
.query-table {
  & /deep/ .el-table-column--selection .cell {
    text-align: center;
    padding-left: 10px;
    padding-right: 10px;
  }
}
.pagniation {
  margin-top: 18px;
  text-align: right;
}
.select-words-con {
  padding-top: $gap;
  padding-bottom: 0;
  min-height: $gap * 2;

  .selected-word-tag {
    display: inline-block;
    margin-right: 18px;
    margin-bottom: 10px;
    font-size: 14px;
    color: #FF4F49;
    user-select: none;

    &:hover {
      opacity: .9;
    }
  }
  .el-icon-close {
    margin-left: 9px;
    cursor: pointer;
  }
}
</style>
