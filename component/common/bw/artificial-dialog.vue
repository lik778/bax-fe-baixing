<template>
  <div>
    <el-dialog title="提交人工报价" :visible="visible" 
               class="artificial-dialog" width="800px" @close="handleClose">
      <el-table :data="data">
        <el-table-column label="关键词" prop="keyword" min-width="120px" />
        <el-table-column label="推广平台" width="160px">
          <template slot-scope="{row}">
            <span v-for="(device,index) in row.devices" :key="device">
              {{DEVICE[device]}}
              {{index !== (row.devices.length - 1) ? ',': ''}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="推广区域" prop="computedAreas" min-width="300px">
          <template slot-scope="{row}">
            <span v-for="(name, index) in row.computedAreas" :key="name">
              {{getCnName(name, allAreas)}}
              {{index !== (row.computedAreas.length - 1)? ',': ''}}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <artificial-tooltip class="tips" />
      <div slot="footer">
        <el-button type="default" @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ArtificialTooltip from './artificial-tooltip'
import { getCnName } from 'util'
import { DEVICE } from 'constant/biaowang'

export default {
  name: 'ArtificialDialog',
  props: {
    allAreas: {
      type: Array,
      default: () => {
        return []
      }
    },
    visible: {
      type: Boolean,
      required: true
    },
    data: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      DEVICE
    }
  },
  components: {
    ArtificialTooltip
  },
  methods: {
    getCnName,
    handleClose() {
      this.$emit('cancel', false)
    },
    handleSubmit() {
      this.handleClose()
      // 发起人工提交接口请求

      this.$confirm('对应关键词已提交，人工报价时间：工作日09:00-17:00，查价返回预计等待3-5小时，请耐心等待。', '提示', {
        showCancelButton: false,
        confirmButtonText: '关闭'
      }).then(res => {
        
      })
    }
  }
}
</script>

<style lang="postcss" scoped>
.artificial-dialog {
  & .tips {
    margin-top: 30px;
    color: #999;
    font-size: 12px;
    line-height: 20px;
  }
}
</style>