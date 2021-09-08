<template>
    <el-dialog
    title="续费确认"
    :visible.sync="dialogVisible"
    width="40%"
    @close="cancel"
    >
    <el-form ref="form" label-width="100px">
        <el-form-item class="pre-info-item" label="关键词：">
            {{renewInfo.words.join("、")}}
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
            <el-radio-group @change="change" v-model="priceId">
                <el-radio :disabled="renewInfo.renewApplyId && renewInfo.renewApplyId !== item.id" v-for="( item, index ) in renewInfo.priceList" :key="index" :label="item.id">{{item.type}} 天</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item class="pre-info-item pre-info-price" label="续费价：">
            {{getRenewprice}}元
        </el-form-item>
        <el-row class="pre-info-row">
            <el-col :span="11">
                <el-form-item class="pre-info-item" label="销售编号：">{{renewInfo.salesId}}</el-form-item>
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
      priceId: 0
    }
  },
  computed: {
    getRenewprice () {
      const { priceId, renewInfo: { priceList } } = this
      console.log(priceId)
      console.log(priceList.filter(o => o.id.toString() === priceId.toString()))
      const price = priceList.filter(o => o.id.toString() === priceId.toString())[0].price
      return f2y(price)
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    preOrder () {
      this.$emit('preOrder', this.priceId)
    },
    citiesFormater (cities) {
      return cities.slice(0, 20).map(city => getCnName(city, this.allAreas)).join(',') + (cities.length > 20 ? `等${cities.length}个城市` : '') || '-'
    },
    change (value) {
      console.log('value', value)
    }
  },
  watch: {
    renewInfo: {
      immediate: true,
      deep: true,
      handler (newV) {
        const { renewApplyId, priceList } = newV
        this.priceId = renewApplyId || priceList[0].id
      }
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
