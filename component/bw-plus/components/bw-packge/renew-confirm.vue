<template>
    <el-dialog
    title="续费确认"
    :visible.sync="dialogVisible_"
    width="48%"
    @close="cancel"
    >
    <el-form ref="form" label-width="100px">
        <el-form-item class="pre-info-item" label="关键词：">
            {{renewInfo.words.join("、")}}
        </el-form-item>
        <el-form-item class="pre-info-item" label="推广城市：">
            {{citiesFormater(renewInfo.cities)}}
        </el-form-item>
        <el-form-item class="pre-info-item pre-info-price" label="续费价：">
            {{getRenewprice}}元
        </el-form-item>
        <el-form-item v-if="showWelfare" class="pre-info-item" label="超值福利：">
          <el-tag
            class="welfare-tag"
            type="danger"
            v-for="(item, index) in welfareInfo.filter( o => o.isActive(getCurrentPrice.type, getCurrentPrice.price).active)"
            :key="index">
            {{item.isActive(getCurrentPrice.type, getCurrentPrice.price).name}} ({{item.isActive(getCurrentPrice.type, getCurrentPrice.price).detail}})
          </el-tag>
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
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { SCHEDULE_TYPE, DEVICE, SERVICE_DAYS, welfareInfo } from 'constant/bw-plus'
dayjs.extend(isBetween)
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
      priceId: 0,
      welfareInfo
    }
  },
  computed: {
    getRenewprice () {
      const { priceId, renewInfo: { priceList } } = this
      const price = priceList.filter(o => o.id.toString() === priceId.toString())[0].price
      return f2y(price)
    },
    showWelfare () {
      const now = dayjs()
      return dayjs(now).isBetween('2022-1-14', '2022-2-1') && (this.getCurrentPrice.type > 30 || f2y(this.getCurrentPrice.price) >= 10000)
    },
    getCurrentPrice () {
      const { priceId, renewInfo: { priceList } } = this
      const currentPrice = priceList.filter(o => o.id.toString() === priceId.toString())[0]
      return currentPrice
    },
    dialogVisible_: {
      get () {
        return this.dialogVisible
      },
      set () {
        this.$emit('cancel')
      }
    }
  },
  methods: {
    cancel () {
      this.dialogVisible_ = false
    },
    preOrder () {
      this.$emit('preOrder', this.priceId)
    },
    citiesFormater (cities) {
      return cities.slice(0, 20).map(city => getCnName(city, this.allAreas)).join(',') + (cities.length > 20 ? `等${cities.length}个城市` : '') || '-'
    },
    change (value) {
    }
  },
  watch: {
    renewInfo: {
      immediate: true,
      deep: true,
      handler (newV) {
        const { renewApplyId, priceList } = newV
        if (renewApplyId && priceList.map(o => o.id).includes(renewApplyId)) {
          this.priceId = renewApplyId
          return
        }
        this.priceId = priceList[0].id
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
    .welfare-tag{
      margin-right: 10px;
    }
</style>
