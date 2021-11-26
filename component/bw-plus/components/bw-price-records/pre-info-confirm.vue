<template>
    <div>
      <div class="row-info">
        <BwDescriptionItem label="关键词：" :value="preInfo.keywords.join('、')"/>
        <!-- <BwDescriptionItem label="词包热度：" :value="preInfo.totalPv"/> -->
        <BwDescriptionItem label="城市：" :value="citiesFormater(preInfo.cities)"/>
      </div>
      <el-table :data="preInfo.additionProductMap" style="width: 100%">
        <el-table-column width="260" prop="name" label="服务" :formatter="productFormatter"/>
        <el-table-column prop="duration" label="服务时长"/>
        <el-table-column prop="originPrice" label="价格（元）" :formatter="priceFormatter"/>
        <el-table-column prop="originPrice" label="优惠（元）" :formatter="spreadFormatter"/>
        <el-table-column prop="dealPrice" label="实付（元）" :formatter="priceFormatter"/>
      </el-table>
      <div class="row-info total-price">
        <BwDescriptionItem label="商品总价：" :value="f2y(totalPrice)"/>
        <BwDescriptionItem label="已优惠：" :value="f2y(spreadPrice)"/>
        <BwDescriptionItem label="提单价：" :value="f2y(totalDealPrice)"/>
      </div>
    </div>
</template>
<script>
import { f2y, getCnName } from 'util'
import BwDescriptionItem from './bw-description-item.vue'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { SCHEDULE_TYPE, DEVICE } from 'constant/bw-plus'
dayjs.extend(isBetween)
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
    }
  },
  data () {
    return {
      f2y
    }
  },
  computed: {
    showWelfare () {
      const now = dayjs()
      return dayjs(now).isBetween('2021-11-1', dayjs('2021-11-11'))
    },
    totalPrice () {
      const { additionProductMap } = this.preInfo
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
      return cities.slice(0, 2).map(city => getCnName(city, this.allAreas)).join(',') + (cities.length > 20 ? `等${cities.length}个城市` : '') || '-'
    },
    productFormatter (row, column, cellValue, index) {
      const { device, scheduleType, displayType } = row
      return displayType ? cellValue : `${cellValue} | ${DEVICE[device]} | ${SCHEDULE_TYPE[scheduleType]}`
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
</style>
