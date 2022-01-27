<template>
    <div>
      <div class="row-info">
        <BwDescriptionItem label="关键词：" :value="preInfo.keywords.join('、')"/>
        <!-- <BwDescriptionItem label="词包热度：" :value="preInfo.totalPv"/> -->
        <BwDescriptionItem label="城市：" :value="citiesFormater(preInfo.cities)"/>
      </div>
      <el-table header-row-class-name="confirm-info-header" :border="true" :data="preInfo.additionProductMap" style="width: 100%">
        <el-table-column header-align="left" width="260" prop="name" label="服务" :formatter="productFormatter"/>
        <el-table-column header-align="left" width="130" prop="duration" label="服务时长（天）"/>
        <el-table-column header-align="left" prop="originPrice" label="价格（元）" :formatter="priceFormatter"/>
        <el-table-column header-align="left" prop="originPrice" label="优惠（元）" :formatter="spreadFormatter"/>
        <el-table-column header-align="left" prop="dealPrice" label="实付（元）" :formatter="priceFormatter"/>
      </el-table>
      <div v-if="showWelfare" class="welfare-info">
        <label v-if="showWelfare">超值福利：</label>
        <el-tag
            class="welfare-tag"
            type="danger"
            v-for="(item, index) in welfareInfo.filter( o => o.isActive(getWelfareInfo.duration, getWelfareInfo.price).active)"
            :key="index">
            {{item.isActive(getWelfareInfo.duration, getWelfareInfo.price).name}} ({{item.isActive(getWelfareInfo.duration, getWelfareInfo.price).detail}})
        </el-tag>
      </div>
      <div class="row-info total-price">
        <BwDescriptionItem label="商品总价：" :value="`${f2y(totalPrice)}元`"/>
        <BwDescriptionItem label="已优惠：" :value="`${f2y(spreadPrice)}元`"/>
        <BwDescriptionItem class="total-price-value" label="提单价：" :value="`${f2y(totalDealPrice)}元`"/>
      </div>
    </div>
</template>
<script>
import { f2y, getCnName } from 'util'
import BwDescriptionItem from './bw-description-item.vue'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { SCHEDULE_TYPE, DEVICE, welfareInfo, IMAGE_PRODUCT_SOURCE, DAIL_BUTTON_PRODUCT_SOURCE, VIDEO_PRODUCT_SOURCE } from 'constant/bw-plus'
dayjs.extend(isBetween)
const creativityProduct = [IMAGE_PRODUCT_SOURCE, DAIL_BUTTON_PRODUCT_SOURCE, VIDEO_PRODUCT_SOURCE]
export default {
  name: 'pre-info-confirm',
  components: { BwDescriptionItem },
  props: {
    preInfo: {
      type: Object,
      default: () => {},
      require: true
    },
    allAreas: {
      type: Array,
      default: () => [],
      required: true
    },
    isRenew: {
      type: Boolean,
      default: false,
      require: false
    }
  },
  data () {
    return {
      f2y,
      welfareInfo
    }
  },
  computed: {
    getWelfareInfo () {
      const { additionProductMap } = this.preInfo
      const { isRenew } = this
      const durationArray = [...additionProductMap.map(info => info.duration)]
      return { duration: Math.max(...durationArray), price: isRenew ? 0 : this.totalDealPrice }
    },
    showWelfare () {
      const now = dayjs()
      return dayjs(now).isBetween('2022-1-14', '2022-2-1') && (this.getWelfareInfo.duration > 30 || f2y(this.getWelfareInfo.price) >= 10000)
    },
    totalPrice () {
      const { additionProductMap } = this.preInfo
      console.log(additionProductMap)
      const sum = additionProductMap.reduce((a, b) => a + b.originPrice, 0)
      return sum
    },
    spreadPrice () {
      return this.totalPrice - this.totalDealPrice
    },
    totalDealPrice () {
      const { additionProductMap } = this.preInfo
      const sum = additionProductMap.reduce((a, b) => a + b.dealPrice, 0)
      return sum
    }
  },
  methods: {
    citiesFormater (cities) {
      return cities.slice(0, 2).map(city => getCnName(city, this.allAreas)).join(',') + (cities.length > 2 ? `等${cities.length}个城市` : '') || '-'
    },
    productFormatter (row, column, cellValue, index) {
      const { device, scheduleType, displayType, sku } = row
      return displayType || creativityProduct.includes(sku) ? cellValue : `${cellValue} | ${DEVICE[device]} | ${SCHEDULE_TYPE[scheduleType]}`
    },
    priceFormatter (...args) {
      const [,, price] = args
      return f2y(price)
    },
    spreadFormatter (row, column, cellValue, index) {
      const { dealPrice, originPrice } = row
      return f2y(originPrice - dealPrice)
    }
  }
}
</script>
<style lang="scss" scoped>
    /deep/ .confirm-info-header{
        background: #FFF1E4;
        th{
          background: #FFF1E4;
          font-family: PingFangSC-Medium;
          font-size: 12px;
          color: #C67C49;
          letter-spacing: 0;
        }
    }
    .welfare-tag{
      margin-right: 8px;
    }
    .row-info{
      display: flex;
      margin-bottom: 20px;
    }
    .total-price{
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
      margin-bottom: 0;
      position: relative;
      padding: 12px 0;
      &::after{
        width: 100%;
        content: '';
        height: 1px;
        background: #ECECEC;
        left: 0;
        bottom: 0;
        position: absolute;
      }
    }
    /deep/ .total-price-value{
        span{
            font-family: PingFangSC-Regular;
            font-size: 18px;
            color: #FF6350;
            letter-spacing: 0;
        }
    }
    .welfare-info{
       margin-top: 20px;
       display: flex;
       align-items: center;
    }
</style>
