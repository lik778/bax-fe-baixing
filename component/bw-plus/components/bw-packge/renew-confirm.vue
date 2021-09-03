<template>
    <el-dialog
    title="续费确认"
    :visible.sync="dialogVisible"
    width="40%"
    @close="cancel"
    >
    <el-form ref="form" label-width="100px">
        <el-form-item class="pre-info-item" label="关键词：">
            {{renewInfo.keywords.join("、")}}
        </el-form-item>
        <el-form-item class="pre-info-item" label="推广城市：">
            {{citiesFormater(renewInfo.cities)}}
        </el-form-item>
        <el-form-item class="pre-info-item" label="推广平台：">
            {{DEVICE[renewInfo.device]}}
        </el-form-item>
        <el-form-item class="pre-info-item" label="推广时段：">
            {{SCHEDULE_TYPE[renewInfo.scheduleType]}}
        </el-form-item>
        <el-form-item class="pre-info-item" label="服务时长：">
            <el-radio-group @change="change" v-model="serviceDays">
                <el-radio v-for="( item, index ) in Object.keys(SERVICE_DAYS)" :key="index" :label="item">{{SERVICE_DAYS[item]}}</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item class="pre-info-item pre-info-price" label="续费价：">
            {{f2y(renewInfo.price)}}元
        </el-form-item>
        <el-row class="pre-info-row">
            <el-col :span="11">
                <el-form-item class="pre-info-item" label="销售编号：">{{renewInfo.saleId}}</el-form-item>
            </el-col>
            <el-col :span="11">
                <el-form-item class="pre-info-item" label="客户手机号：">{{renewInfo.mobile}}</el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="preOrder">确认，生成并复制提单链接</el-button>
    </span>
    </el-dialog>
</template>
<script>
import { f2y, getCnName } from 'util'
import { SCHEDULE_TYPE, DEVICE, SERVICE_DAYS } from 'constant/bw-plus'
export default {
  name: 'renew-confirm',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
      require: true
    },
    renewInfo: {
      type: Object,
      default: () => {},
      require: true
    },
    allAreas: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  data () {
    return {
      SCHEDULE_TYPE,
      f2y,
      DEVICE,
      SERVICE_DAYS,
      serviceDays: '365'
    }
  },
  watch: {
    renewInfo: {
      immediate: true,
      deep: true,
      handler (newV) {
        if (newV) {
          this.serviceDays = newV.days > 0 ? newV.days.toString() : '365'
        }
      }
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    preOrder () {
      this.$emit('preOrder')
    },
    citiesFormater (cities) {
      return cities.slice(0, 20).map(city => getCnName(city, this.allAreas)).join(',') + (cities.length > 20 ? `等${cities.length}个城市` : '') || '-'
    },
    change (value) {
      console.log('value', value)
    }
  }
}
</script>
<style lang="scss" scoped>
    .pre-info-item{
        margin-bottom: 0;
        font-size: 16px;
        font-weight: 500;
    }
    .pre-info-row{
        border-bottom: 1px solid #ddd;
        border-top: 1px solid #ddd;
        padding: 10px 0;
        margin-top: 10px;
        font-size: 16px;
        font-weight: 500;
    }
    .pre-info-price{
        color: crimson;
    }
</style>
