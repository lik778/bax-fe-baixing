<template>
  <el-dialog :visible="visible"
             @close="handleCancel"
             class="select-promote-dialog">
    <h4 slot="title"
        class="header">应用到更多计划
      <span>请选择需要应用到的计划</span>
    </h4>
    <div class="content">
      <el-checkbox :indeterminate="isIndeterminate"
                   v-model="checkAll"
                   style="margin-bottom: 20px"
                   @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group v-model="checkedPromoteIds"
                         v-for="(keywordPromotes) in promotes"
                         @change="handleCheckedPromotesChange"
                         :key="keywordPromotes.id">
        <el-checkbox v-for="promote in keywordPromotes"
                     :label="promote.id"
                     :key="promote.id"
                     class="checkbox-item">
          {{promote.keyword}}*{{DEVICE[promote.device]}}
        </el-checkbox>
      </el-checkbox-group>
      <div class="content-tip" v-if="tipShow">
        <p v-for="(item,index) in YINGYONG_TIP" :key="index">{{item}}</p>
      </div>
    </div>
    <footer slot="footer"
            class="footer">
      <el-button type="default"
                 @click="handleCancel">取消</el-button>
      <el-button type="primary"
                 @click="handleConfirm"
                 :loading="loading">确定</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import { getUsePromoteListByPackageId } from 'api/biaowang-plus'
import { DEVICE, YINGYONG_TIP } from 'constant/bw-plus'
import clone from 'clone'

export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    packageId: {
      type: [String, Number],
      required: true
    },
    promoteIds: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    loading: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data () {
    return {
      DEVICE,
      YINGYONG_TIP,
      isIndeterminate: false,
      checkAll: false,
      checkedPromoteIds: [],
      originPromotes: [],
      promotes: [],
      tipShow: false
    }
  },
  mounted () {
    this.getPromoteData()
  },
  methods: {
    async getPromoteData () {
      const data = await getUsePromoteListByPackageId(this.packageId)
      this.originPromotes = clone(data)
      data.sort((a, b) => a.device - b.device)
      this.promotes = data.reduce((curr, prev) => {
        const keyword = prev.keyword
        if (keyword in curr) {
          curr[keyword] = curr[keyword].concat([prev])
        } else {
          curr[keyword] = [prev]
        }
        return curr
      }, {})
    },
    handleCheckedPromotesChange (val) {
      const checkedCount = val.length
      const promoteLen = this.originPromotes.length
      this.checkAll = checkedCount === promoteLen
      this.isIndeterminate = checkedCount > 0 && checkedCount < promoteLen
      this.tipShow = true
    },
    handleCheckAllChange (val) {
      this.checkedPromoteIds = val ? this.originPromotes.map(o => o.id) : []
      this.isIndeterminate = false
      this.tipShow = true
    },
    handleCancel () {
      this.$emit('close')
    },
    handleConfirm () {
      this.$emit('update-promote-ids', this.checkedPromoteIds)
    }
  },
  watch: {
    promoteIds: {
      immediate: true,
      deep: true,
      handler () {
        this.checkedPromoteIds = clone(this.promoteIds)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.select-promote-dialog {
  /deep/ .el-dialog__header {
    border-bottom: 1px solid #ddd;
  }
   /deep/ .el-dialog__body {
    padding: 20px 20px 0px 20px;
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
    .content-tip{
      padding: 20px 0;
      font-size: 12px;
      color: #666;
    }
  }
}
</style>
