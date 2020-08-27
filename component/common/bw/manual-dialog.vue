<template>
  <div>
    <el-dialog title="提交查价" :visible="visible" 
               class="artificial-dialog" width="800px" @close="handleClose">
      <el-table :data="data">
        <el-table-column label="关键词" prop="word" />
        <el-table-column label="推广区域" prop="cities">
          <template slot-scope="{row}">
            <el-tooltip popper-class="city-tooltip" class="item" effect="light" 
              :content="cityFormatter(row.cities, row.cities.length)" placement="right">
              <p>{{cityFormatter(row.cities, citiesMax)}}</p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="推广平台">
          <template slot-scope="{row}">
            <div v-if="row.devices.length > 1">
              <el-select v-model="device" size="small" placeholder="请选择">
                <el-option v-for="(v, k) in DEVICE" 
                           :key="v" :label="v" :value="k" />
              </el-select>
            </div>
            <div v-else>
              <span v-for="(device,index) in row.devices" :key="device">
                {{DEVICE[device]}}
                {{index !== (row.devices.length - 1) ? '，': ''}}
              </span>
            </div>
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

const citiesMax = 20

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
      required: true,
      default: () => {
        return {}
      }
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
      device: '',
      citiesMax
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
    cityFormatter(cities , max = citiesMax) {
      return cities.slice(0, max).map(city => getCnName(city, this.allAreas)).join('，') + (cities.length > max ? `等${cities.length}个城市` : '')
    },
    async handleSubmit() {
      this.handleClose()
      const opts = pick(this.manualData, ['cities', 'manualCities', 'targetUserId', 'word'])
      await sendUserManualApply(Object.assign({
        ...opts,
        device: Number(this.device)
      }))
      
      this.$confirm('对应关键词已提交，人工报价时间：工作日09:00-17:00，查价返回预计等待3-5小时，请耐心等待。', '提示', {
        showCancelButton: false,
        confirmButtonText: '关闭'
      })
    }
  },
  watch: {
    'manualData.devices'(newVal) {
      if (Array.isArray(newVal) && newVal.length > 0) {
        this.device = String(newVal[0])
      } 
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