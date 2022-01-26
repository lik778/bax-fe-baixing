<template>
    <div class="bw-plus-renew-upgrade">
        <header>续费</header>
        <section class="bw-plus-renew-upgrade_content">
            <ul class="package-info">
                <li>词包id: {{renewDetails.packageId}}</li>
                <li>关键词: {{renewDetails.words.join('、')}}</li>
                <li>所选城市: {{renewDetails.cities.join('、')}}</li>
            </ul>
            <Title
                title="百度标王"
                subTitle="标准版"
                subExtra="（不含配图）请选择需要的平台*时段*时长"
            />
            <el-table
            border
            header-row-class-name="thead-row"
            :data="BAIDU_BW_PRODUCT_PRICELIST"
            :cell-style="{ background: '#fff', cursor: 'pointer' }"
            style="width: 100%">
                <el-table-column align="center" prop="duration">
                    <template slot-scope="{ row }">
                        <span class="row-day">延长{{ row.duration }}天</span>
                        <el-tag class="tag-type" effect="dark" v-if="row.duration > 30"
                        >送店铺</el-tag
                        >
                    </template>
                </el-table-column>
                <el-table-column align="center" label="双端报价">
                    <el-table-column align="center" label="7天*24小时（元）">
                        <template slot-scope="{ row }">
                            <div @click="cellClick(row, DEVICE_ALL, 724)" :class="{'active-item': isActive(row, DEVICE_ALL, 724),
              'option-item': true,'diabled': !transformDeviceAllPrice(row, DEVICE_ALL, 724).allowRenew}" v-if="transformDeviceAllPrice(row, DEVICE_ALL, 724).allowRenew">
                                {{transformDeviceAllPrice(row, DEVICE_ALL, 724).soldAvailable ? f2y(transformDeviceAllPrice(row, DEVICE_ALL, 724).price) : '已售出'}}
                            </div>
                            <el-popover
                                v-else
                                placement="top-start"
                                width="200"
                                title="提示"
                                trigger="hover"
                                content="暂未开放，敬请期待"
                            >
                                <span class="sold-item" slot="reference">--</span>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="5天*8小时（元）">
                        <template slot-scope="{ row }">
                            <div @click="cellClick(row, DEVICE_ALL, 58)" :class="{'active-item': isActive(row, DEVICE_ALL, 58),
              'option-item': true,'diabled': !transformDeviceAllPrice(row, DEVICE_ALL, 58).allowRenew}" v-if="transformDeviceAllPrice(row, DEVICE_ALL, 58).allowRenew">
                                {{transformDeviceAllPrice(row, DEVICE_ALL, 58).soldAvailable ? f2y(transformDeviceAllPrice(row, DEVICE_ALL, 58).price) : '已售出'}}
                            </div>
                            <el-popover
                                v-else
                                placement="top-start"
                                width="200"
                                title="提示"
                                trigger="hover"
                                content="暂未开放，敬请期待"
                            >
                                <span class="sold-item" slot="reference">--</span>
                            </el-popover>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="手机端报价">
                    <el-table-column align="center" label="7天*24小时（元）">
                        <template slot-scope="{ row }">
                            <div @click="cellClick(row, DEVICE_WAP, 724)" :class="{'active-item': isActive(row, DEVICE_WAP, 724),
              'option-item': true,'diabled': !transformDeviceAllPrice(row, DEVICE_WAP, 724).allowRenew}" v-if="transformDeviceAllPrice(row, DEVICE_WAP, 724).allowRenew">
                                {{transformDeviceAllPrice(row, DEVICE_WAP, 724).soldAvailable ? f2y(transformDeviceAllPrice(row, DEVICE_WAP, 724).price) : '已售出'}}
                            </div>
                            <el-popover
                                v-else
                                placement="top-start"
                                width="200"
                                title="提示"
                                trigger="hover"
                                content="暂未开放，敬请期待"
                            >
                                <span class="sold-item" slot="reference">--</span>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="5天*8小时（元）">
                        <template slot-scope="{ row }">
                            <div @click="cellClick(row, DEVICE_WAP, 58)" :class="{'active-item': isActive(row, DEVICE_WAP, 58),
              'option-item': true,'diabled': !transformDeviceAllPrice(row, DEVICE_WAP, 58).allowRenew}" v-if="transformDeviceAllPrice(row, DEVICE_WAP, 58).allowRenew">
                                {{transformDeviceAllPrice(row, DEVICE_WAP, 58).soldAvailable ? f2y(transformDeviceAllPrice(row, DEVICE_WAP, 58).price) : '已售出'}}
                            </div>
                            <el-popover
                                v-else
                                placement="top-start"
                                width="200"
                                title="提示"
                                trigger="hover"
                                content="暂未开放，敬请期待"
                            >
                                <span class="sold-item" slot="reference">--</span>
                            </el-popover>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="电脑端报价">
                    <el-table-column align="center" label="7天*24小时（元）">
                        <template slot-scope="{ row }">
                            <div @click="cellClick(row, DEVICE_PC, 724)" :class="{'active-item': isActive(row, DEVICE_PC, 724),
              'option-item': true,'diabled': !transformDeviceAllPrice(row, DEVICE_PC, 724).allowRenew}" v-if="transformDeviceAllPrice(row, DEVICE_PC, 724).allowRenew">
                                {{transformDeviceAllPrice(row, DEVICE_PC, 724).soldAvailable ? f2y(transformDeviceAllPrice(row, DEVICE_PC, 724).price) : '已售出'}}
                            </div>
                            <el-popover
                                v-else
                                placement="top-start"
                                width="200"
                                title="提示"
                                trigger="hover"
                                content="暂未开放，敬请期待"
                            >
                                <span class="sold-item" slot="reference">--</span>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="5天*8小时（元）">
                        <template slot-scope="{ row }">
                            <div @click="cellClick(row, DEVICE_PC, 58)" :class="{'active-item': isActive(row, DEVICE_PC, 58),
              'option-item': true,'diabled': !transformDeviceAllPrice(row, DEVICE_PC, 58).allowRenew}" v-if="transformDeviceAllPrice(row, DEVICE_PC, 58).allowRenew">
                                {{transformDeviceAllPrice(row, DEVICE_PC, 58).soldAvailable ? f2y(transformDeviceAllPrice(row, DEVICE_PC, 58).price) : '已售出' }}
                            </div>
                            <el-popover
                                v-else
                                placement="top-start"
                                width="200"
                                title="提示"
                                trigger="hover"
                                content="暂未开放，敬请期待"
                            >
                                <span class="sold-item" slot="reference">--</span>
                            </el-popover>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
            <BwCreativity
                @checked="checked"
                :productList="additionalSkuList"
                :additionRenewDetailList="renewDetails.additionRenewDetailList"
                :currentPrice="currentRenewInfo"
                :isRenew="true"
            />
            <footer>
                <WelfareLayout :currentPrice="getWelfareInfo" />
                <div>
                    <h3>续费价：{{f2y(totalPrice)}}</h3>
                    <el-button type="primary" @click="visible=true">确认</el-button>
                </div>
            </footer>
        </section>
        <el-dialog
          title="续费升级确认"
          :visible.sync="visible"
          width="50%"
          @close="visible=false"
        >
          <PreInfoConfirm :allAreas="allAreas" :preInfo="preInfo"/>
          <span slot="footer" class="dialog-footer">
            <el-button @click="visible=false">取 消</el-button>
            <el-button type="primary" :loading="isPending" @click="submit">确认，生成并复制提单链接</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
import { getRenewPriceByPackageId } from 'api/biaowang-plus'
import { Title, BwCreativity, PreInfoConfirm, WelfareLayout } from '../components'
import { BAIDU_BW_PRODUCT_PRICELIST, DEVICE_ALL, DEVICE_WAP, DEVICE_PC, SEO_PRODUCT_TYPE, CREATIVE_PRODUCT_TYPE } from 'constant/bw-plus'
import { f2y } from 'util'
export default {
  name: 'renew-upgrade',
  components: {
    Title,
    BwCreativity,
    PreInfoConfirm,
    WelfareLayout
  },
  props: {
    allAreas: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      renewDetails: {},
      BAIDU_BW_PRODUCT_PRICELIST,
      DEVICE_ALL,
      DEVICE_WAP,
      DEVICE_PC,
      f2y,
      currentRenewInfo: {},
      additionalSkuList: {},
      visible: false,
      isPending: false
    }
  },
  async mounted () {
    const { packageId } = this.$route.query
    const { data, data: { additionalSkuList } } = await getRenewPriceByPackageId({ packageId })
    this.renewDetails = data
    this.additionalSkuList = additionalSkuList.map(a => ({ ...a, checked: false }))
  },
  computed: {
    getWelfareInfo () {
      const { currentRenewInfo } = this
      return {
        ...currentRenewInfo,
        price: 0
      }
    },
    totalPrice () {
      const { currentRenewInfo: { price = 0 }, additionalSkuList, getPrice } = this
      const ratio =
        price && price > 0
          ? 'dealPriceRatio'
          : 'withoutPackagePriceRatio'
      const total = additionalSkuList.reduce((producPrev, producNext) => {
        const priceB = producNext.checked
          ? producNext.type === SEO_PRODUCT_TYPE
              ? price && price > 0
                  ? producNext.certainDealPrice
                  : producNext.withoutPackageCertainDealPrice
              : (getPrice(producNext).extraOriginPrice + price) * producNext[ratio]
          : 0
        return producPrev + priceB
      }, 0)
      return (total + price) || '-'
    },
    preInfo () {
      // 构造选中商品列表数据，给用户确认
      const { renewDetails, additionalSkuList, currentRenewInfo: { price = 0, days = 0, device, scheduleType }, getPrice, currentRenewInfo } = this
      const ratio =
       price && price > 0
         ? 'dealPriceRatio'
         : 'withoutPackagePriceRatio'
      const checkedProducts = additionalSkuList.filter((p) => p.checked)
      const additionProduct = checkedProducts.map((o) => ({
        dealPrice:
          o.type === SEO_PRODUCT_TYPE
            ? price && price > 0
                ? o.certainDealPrice
                : o.withoutPackageCertainDealPrice
            : (getPrice(o).extraOriginPrice + price) * o[ratio],
        device,
        duration: getPrice(o).extraDays + days,
        name: o.title,
        originPrice:
          o.type === SEO_PRODUCT_TYPE
            ? o.certainOriginPrice
            : (getPrice(o).extraOriginPrice + price) * o.originalPriceRatio,
        scheduleType,
        displayType:
          o.type === SEO_PRODUCT_TYPE || o.type === CREATIVE_PRODUCT_TYPE
            ? 1
            : 0
      }))
      const BAIDU_BW = [
        {
          dealPrice: price,
          originPrice: price,
          name: '百度标王标准版',
          ...currentRenewInfo,
          duration: currentRenewInfo.days,
          displayType: 0
        }
      ]
      const preInfo = {
        keywords: renewDetails.words,
        cities: renewDetails.cities,
        additionProductMap:
          price && price > 0
            ? [...additionProduct, ...BAIDU_BW]
            : additionProduct
      }
      return preInfo
    }
  },
  methods: {
    submit () {
      this.isPending = true
      console.log(this.preInfo)
    },
    getPrice (product) {
      const { additionRenewDetailList } = this.renewDetails
      return additionRenewDetailList.find(a => a.sku === product.id)
    },
    transformDeviceAllPrice (row, device, scheduleType) {
      const { duration } = row
      const { phoenixsPriceList } = this.renewDetails
      const target = phoenixsPriceList.find(p => p.device === device && p.scheduleType === scheduleType)
      if (target) {
        if (duration) {
          const { daysPriceList } = target
          const cellValue = daysPriceList.find(d => d.days === duration)
          return { ...cellValue, allowRenew: true }
        }
        return { allowRenew: true, price: 0, device, scheduleType, duration, days: duration, soldAvailable: true }
      }
      return {
        allowRenew: false
      }
    },
    cellClick (row, device, scheduleType) {
      const { phoenixsPriceList } = this.renewDetails
      const target = phoenixsPriceList.find(p => p.device === device && p.scheduleType === scheduleType)
      if (row.duration === 0) {
        this.currentRenewInfo = {
          price: 0,
          device,
          scheduleType,
          days: row.duration
        }
        return
      }
      this.currentRenewInfo = { ...target.daysPriceList.find(d => d.days === row.duration), device, scheduleType }
    },
    isActive (row, device, scheduleType) {
      const { currentRenewInfo } = this
      return currentRenewInfo.device === device && currentRenewInfo.scheduleType === scheduleType && currentRenewInfo.days === row.duration
    },
    checked (product) {
      const { additionalSkuList } = this
      this.additionalSkuList = additionalSkuList.map((p) =>
        product.id === p.id ? product : p
      )
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .thead-row {
  th {
    background: #fff1e3 !important;
    border-right: 1px solid #ffddd2;
    border-bottom: 1px solid #ffddd2;
    color: #d4a47c;
  }
}
.diabled {
  color: #909399;
  pointer-events: none;
}

</style>
<style lang="scss" scoped src="./index.scss" />
