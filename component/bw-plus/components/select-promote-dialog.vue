<template>
  <el-dialog :visible="visible"
             class="select-promote-dialog">
    <h4 slot="title"
        class="header">应用到更多计划
      <span>请选择需要应用到的计划</span>
    </h4>
    <div class="content">
      <el-checkbox :indeterminate="isIndeterminate"
                   v-model="checkAll"
                   @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group v-model="checkedPromotes"
                         @change="handleCheckedPromotesChange"
                         style="margin-top: 16px">
        <el-checkbox v-for="promote in promotes"
                     :label="promote.id"
                     :key="promote.id"
                     class="checkbox-item">
          {{promote.keyword}}*{{promote.platform}}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <footer slot="footer"
            class="footer">
      <el-button type="default">取消</el-button>
      <el-button type="primary">确定</el-button>
    </footer>
  </el-dialog>
</template>

<script>

export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isIndeterminate: true,
      checkAll: true,
      checkedPromotes: [],
      originPromotes: [],
      promotes: []
    }
  },
  mounted () {
    this.getPromoteData()
  },
  methods: {
    getPromoteData () {
      this.originPromotes = [
        {
          id: 1,
          keyword: '关键词1',
          platform: '电脑端'
        },
        {
          id: 2,
          keyword: '关键词2',
          platform: '手机端'
        },
        {
          id: 3,
          keyword: '关键词2',
          platform: '电脑端'
        },
        {
          id: 4,
          keyword: '关键词1',
          platform: '手机端'
        }
      ]

      this.promotes = this.originPromotes
    },
    handleCheckedPromotesChange (val) {
      const checkedCount = val.length
      const promoteLen = this.promotes.length
      this.checkAll = checkedCount === promoteLen
      this.isIndeterminate = checkedCount > 0 && checkedCount < promoteLen
    },
    handleCheckAllChange (val) {
      this.checkedPromotes = val ? this.promotes.filter(o => o.id) : []
      this.isIndeterminate = false
    }
  }
}
</script>

<style lang='scss' scoped>
.select-promote-dialog {
  /deep/ .el-dialog__header {
    border-bottom: 1px solid #ddd;
  }
  /deep/ .el-dialog__footer {
    border-top: 1px solid #ddd;
  }
  .header {
    > span {
      color: #666;
      font-size: 14px;
      font-weight: normal;
    }
  }
  .content {
    min-height: 200px;
    .checkbox-item {
      margin-bottom: 14px;
    }
  }
}
</style>
