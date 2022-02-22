<template>
    <div>
      <el-table header-row-class-name="confirm-info-header" :border="true" :data="preInfo.additionProductMap" style="width: 100%">
        <el-table-column header-align="left" width="260" prop="skuId" label="套餐" :formatter="packageFormatter" v-if="!scheduleType" />
        <el-table-column header-align="left" width="260" prop="name" label="服务" :formatter="productFormatter" />
        <el-table-column header-align="left" width="130" prop="duration" label="服务时长（天）"/>
        <el-table-column header-align="left" prop="originPrice" label="价格（元）" :formatter="priceFormatter"/>
        <el-table-column header-align="left" prop="originPrice" label="优惠（元）" :formatter="spreadFormatter"/>
        <el-table-column header-align="left" prop="dealPrice" label="实付（元）" :formatter="priceFormatter"/>
      </el-table>
      <ul class="desc-box" v-if="preInfo.keywords.length!=0&&scheduleType">
        <li class="title">标王体验版说明</li>
        <li>关键词：<p>{{preInfo.keywords.slice(0,3).join('、')}}...等 <span>20</span>个词</p></li>
        <li>城市：<p>{{citiesFormater(preInfo.cities)}}</p></li>
      </ul>
      <div class="row-info total-price">
        <p>商品总价：{{`${f2y(totalPrice)}元`}}</p>
        <p>已优惠：{{`${f2y(spreadPrice)}元`}}</p>
        <p class="total-price-value">提单价：{{`${f2y(totalDealPrice)}元`}}</p>
      </div>
    </div>
</template>
<script>
import { f2y, getCnName } from 'util'
import dayjs from 'dayjs'
import { SCHEDULE_TYPE, DEVICE } from 'constant/bw-plus'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)
export default {
  name: 'pre-info-confirm',
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
      f2y,
      scheduleType: ''
    }
  },
  computed: {
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
      return cities.slice(0, 3).map(city => getCnName(city, this.allAreas)).join(',') + (cities.length > 3 ? `...等${cities.length}个城市` : '') || '-'
    },
    priceFormatter (...args) {
      const [,, price] = args
      return f2y(price)
    },
    spreadFormatter (row, column, cellValue, index) {
      const { dealPrice, originPrice } = row
      return f2y(originPrice - dealPrice)
    },
    productFormatter (row, column, cellValue, index) {
      const { device, scheduleType, displayType } = row
      this.scheduleType = scheduleType
      if (scheduleType) {
        return displayType ? cellValue : `${cellValue} | ${DEVICE[device]} | ${SCHEDULE_TYPE[scheduleType]}`
      } else {
        return row.name
      }
    },
    packageFormatter (row, column, cellValue, index) {
      const { skuId } = row
      return skuId === 312 ? '基础版' : '高级版'
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
    .desc-box{
      .title{
        font-weight:bold;
      }
      margin:20px 0 30px;
      li{
        p{
          font-weight:bold;
          display: inline-block;
          span{
            color: #02a7f0;
          }
        }
      }
    }
    .row-info{
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
      margin-top: 10px;
       p{
        margin-left: 10px;
      }
    }
    .total-price{
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
      margin-bottom: 0;
      position: relative;
      padding: 12px 10px;

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
