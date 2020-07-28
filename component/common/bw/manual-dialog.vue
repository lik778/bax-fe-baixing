<template>
  <div>
    <el-dialog title="提交人工报价" :visible="visible" 
               class="artificial-dialog" width="800px" @close="handleClose">
      <el-table :data="data">
        <el-table-column label="关键词" prop="word" />
        <el-table-column label="推广平台">
          <template slot-scope="{row}">
            <div v-if="row.devices.length > 1">
              <el-select v-model="device" size="small">
                <el-option v-for="(v, k) in DEVICE" :key="k" :label="v" :value="k" />
              </el-select>
            </div>
            <div v-else>
              <span v-for="(device,index) in row.devices" :key="device">
                {{DEVICE[device]}}
                {{index !== (row.devices.length - 1) ? ',': ''}}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="推广区域" prop="manualCities">
          <template slot-scope="{row}">
            <span v-for="(name, index) in row.manualCities" :key="name">
              {{getCnName(name, allAreas)}}
              {{index !== (row.manualCities.length - 1)? ',': ''}}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <manual-tooltip class="tips" />
      <div slot="footer">
        <el-button type="default" @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pick from 'lodash.pick'
import ManualTooltip from './manual-tooltip'
import { getCnName } from 'util'
import { DEVICE } from 'constant/biaowang'
import { sendUserManualApply } from 'api/biaowang'
import { device } from '../../../constant/fengming'

export default {
  name: 'ManualDialog',
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
    manualData: {
      type: Object,
      required: true
    }
  },
  computed: {
    data() {
      return [].concat(this.manualData)
    }
  },
  data() {
    return {
      DEVICE,
      device
    }
  },
  components: {
    ManualTooltip
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
      }).then( async res => {
        const opts = pick(this.manualData, ['cities', 'manualCities', 'targetUserId', 'word'])
        await sendUserManualApply(Object.assign({
          ...opts,
          device: this.device
        }))
      }).catch(err => {

      })
    }
  },
  watch: {
    'manualData.devices'(newVal, oldVal) {
      console.log(newVal)
      console.log(oldVal)
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