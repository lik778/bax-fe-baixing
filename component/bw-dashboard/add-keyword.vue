<template>
  <el-dialog :visible.sync="show"
             width="964px"
             custom-class="bw-dashboard-keyword-modal"
             :before-close="handleClose">
    <div slot="title"
         class="header">
      <span class="title">选择关键词</span>
      <span class="current-selected">已选关键词（{{selectedCount}}）</span>
    </div>

    <div class="main">
      <el-form ref="queryBwKeyword"
               :model="query"
               label-width="100px"
               label-position="left"
               @submit.native.prevent>
        <el-form-item label="关键词">
          <el-input v-model="query.word"
                    placeholder="输入关键词查询"
                    style="width: 300px;" />
        </el-form-item>
        <el-form-item label="投放状态">
          <el-checkbox-group class="status-checkbox-group"
                             v-model="query.promoteStatusFilters">
            <el-checkbox :label="opt.value"
                         v-for="(opt, index) in promoteStatusOpts"
                         :key="index">
              {{opt.label}}
            </el-checkbox>
          </el-checkbox-group>
          <el-checkbox-group class="status-checkbox-group"
                             v-model="query.auditStatusFilters">
            <el-checkbox :label="opt.value"
                         v-for="(opt, index) in auditStatusOpts"
                         :key="index">{{opt.label}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <keyword-list :data="promotes"
                    :original-promotes="originalPromotes"
                    ref="keywordList"
                    :canSelected="true"
                    :all-areas="allAreas"
                    @selection-change="handleSelectionChange"></keyword-list>
    </div>

    <div slot="footer"
         class="footer">
      <el-pagination class="pagination"
                     layout="prev, pager, next"
                     :total="totalPage"
                     :page-size="query.size"
                     :current-page="query.currentPage"
                     @current-change="handleCurrentChange">
      </el-pagination>
      <el-button type="primary"
                 size="small"
                 @click="handleClose">已选完查看关键词
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import KeywordList from './keyword-list'
import { promoteStatusOpts, auditStatusOpts } from 'constant/biaowang'
import { getPromotes } from 'api/biaowang'
import clone from 'clone'

export default {
  name: 'bw-dashboard-add-keyword',
  props: {
    show: {
      type: Boolean,
      required: true,
      default: true,
    },
    originalPromotes: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    allAreas: {
      type: Array,
      required: true
    }
  },
  components: {
    KeywordList
  },
  data () {
    return {
      query: {
        word: '',
        promoteStatusFilters: [],
        auditStatusFilters: [],
        size: 5,
      },
      currentPage: 1,
      totalPage: 0,
      promotes: [],
      selectedPromotes: [],
      promoteStatusOpts,
      auditStatusOpts,
    }
  },
  computed: {
    selectedCount() {
      return this.selectedPromotes.length
    }
  },
  methods: {
    handleClose() {
      this.$emit('close', this.selectedPromotes)
      this.selectedPromotes = []
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.getPromoteList()
    },
    async getPromoteList(page) {
      const {size, word, promoteStatusFilters, auditStatusFilters} = this.query
      const {items, total} = await getPromotes({
        page: this.currentPage - 1,
        size, 
        word,
        status: promoteStatusFilters,
        auditStatus: auditStatusFilters
      })
      this.promotes = items
      this.totalPage = total
    },
    handleSelectionChange(newCampaigns) {
      this.selectedPromotes = newCampaigns
    },
    getRowKeys(row) {
      return row.id
    }
  },
  watch: {
    query: {
      deep: true,
      immediate: true,
      handler() {
        this.currentPage = 1
        this.getPromoteList()
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.bw-dashboard-keyword-modal {
  & .header {
    display: flex;
    align-items: center;
    background: #f9f9f9;
    height: 50px;
    padding: 20px;
    & > .title {
      color: #333;
      font-size: 16px;
      font-weight: bold;
    }
    & > .current-selected,
    & > .all-selected {
      color: #ff6350;
      font-size: 12px;
      margin-left: 20px;
    }
  }
  & .main {
    & .status-checkbox-group {
      display: inline-block;
      &:not(:first-child) {
        margin-left: 30px;
      }
    }
  }
  & .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>

<style lang="postcss">
.bw-dashboard-keyword-modal {
  & > .el-dialog__header {
    padding: 0;
  }
  & .el-dialog__headerbtn {
    top: 16px;
  }
  & .el-dialog__body {
    padding-bottom: 15px;
  }
}
</style>