<template>
    <div class="bw-plus-renew-upgrade">
        <header>续费</header>
        <section class="bw-plus-renew-upgrade_content">
            <ul class="package-info">
                <li>词包id: {{renewDetails.packageId}}</li>
                <li>关键词: {{renewDetails.words.join('、')}}</li>
                <li>所选城市: {{citiesFormater(renewDetails.cities)}}</li>
            </ul>
            <p class="bax-el-alert"><i class="el-icon-warning"></i>{{getExtraDetail}}</p>
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
                        <el-tag class="tag-type" effect="dark" v-if="row.duration >= 30"
                        >送店铺</el-tag
                        >
                    </template>
                </el-table-column>
                <el-table-column align="center" label="双端报价">
                    <el-table-column align="center" label="7天*24小时（元）">
                        <template slot-scope="{ row }">
                            <div @click="cellClick(row, DEVICE_ALL, 724)" :class="{'active-item': isActive(row, DEVICE_ALL, 724),
              'option-item': true,'diabled': !transformDeviceAllPrice(row, DEVICE_ALL, 724).allowRenew || !transformDeviceAllPrice(row, DEVICE_ALL, 724).soldAvailable}" v-if="transformDeviceAllPrice(row, DEVICE_ALL, 724).allowRenew">
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
              'option-item': true,'diabled': !transformDeviceAllPrice(row, DEVICE_ALL, 58).allowRenew || !transformDeviceAllPrice(row, DEVICE_ALL, 58).soldAvailable}" v-if="transformDeviceAllPrice(row, DEVICE_ALL, 58).allowRenew">
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
              'option-item': true,'diabled': !transformDeviceAllPrice(row, DEVICE_WAP, 724).allowRenew || !transformDeviceAllPrice(row, DEVICE_WAP, 724).soldAvailable}" v-if="transformDeviceAllPrice(row, DEVICE_WAP, 724).allowRenew">
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
              'option-item': true,'diabled': !transformDeviceAllPrice(row, DEVICE_WAP, 58).allowRenew || !transformDeviceAllPrice(row, DEVICE_WAP, 58).soldAvailable}" v-if="transformDeviceAllPrice(row, DEVICE_WAP, 58).allowRenew">
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
              'option-item': true,'diabled': !transformDeviceAllPrice(row, DEVICE_PC, 724).allowRenew || !transformDeviceAllPrice(row, DEVICE_PC, 724).soldAvailable}" v-if="transformDeviceAllPrice(row, DEVICE_PC, 724).allowRenew">
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
              'option-item': true,'diabled': !transformDeviceAllPrice(row, DEVICE_PC, 58).allowRenew || !transformDeviceAllPrice(row, DEVICE_PC, 58).soldAvailable}" v-if="transformDeviceAllPrice(row, DEVICE_PC, 58).allowRenew">
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
                :disableSkuList="renewDetails.disableSkuList"
                :currentPrice="currentRenewInfo"
                :isRenew="true"
            />
            <div :style="{height: '130px'}"></div>
            <footer>
                <WelfareActivity
                    :item="welfareInfo"
                    :currentPrice="getWelfareInfo" />
                <div>
                    <h3>续费价：{{totalPrice}}元</h3>
                    <el-button type="primary" :disabled="totalPrice === '-' || totalPrice <= 0" @click="visible=true">确认</el-button>
                </div>
            </footer>
        </section>
        <el-dialog
          title="续费升级确认"
          :visible.sync="visible"
          width="50%"
          @close="visible=false"
        >
          <PreInfoConfirm :isRenew="true" :allAreas="allAreas" :preInfo="preInfo"/>
          <span slot="footer" class="dialog-footer">
            <el-button @click="visible=false">取 消</el-button>
            <el-button type="primary" :loading="isPending" @click="submit">确认，生成并复制提单链接</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
import { getRenewPriceByPackageId, submitPreOrder } from 'api/biaowang-plus'
import { Title, BwCreativity, PreInfoConfirm, WelfareActivity } from '../components'
import { BAIDU_BW_PRODUCT_PRICELIST, DEVICE_ALL, DEVICE_WAP, DEVICE_PC, SEO_PRODUCT_TYPE, CREATIVE_PRODUCT_TYPE, BAIDU_PRODUCT_SOURCE, PRODUCT_SOURCE_MAP } from 'constant/bw-plus'
import { f2y, getCnName } from 'util'
import { Message } from 'element-ui'
const welfareInfo = {
  id: 1,
  title: '会员钻石店铺',
  value: (price) => 1200,
  desc: '',
  content: (price) => ['双端适配', '视频展示', '智能接待系统', '支持seo优化'],
  isActive: (duration, price) => {
    const active = duration >= 30
    return {
      active,
      tag: active ? `赠送${duration}天` : '',
      detail: `${duration}天`,
      name: '会员钻石店铺'
    }
  },
  show: true
}
export default {
  name: 'renew-upgrade',
  components: {
    Title,
    BwCreativity,
    PreInfoConfirm,
    WelfareActivity
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
      isPending: false,
      welfareInfo
    }
  },
  async mounted () {
    const { packageId } = this.$route.query
    const { data, data: { additionalSkuList } } = await getRenewPriceByPackageId({ packageId })
    this.renewDetails = data
    this.additionalSkuList = additionalSkuList.map(a => ({ ...a, checked: false }))
    this.currentRenewInfo = { ...data.phoenixsPriceList[0].daysPriceList.find(d => d.soldAvailable), device: data.phoenixsPriceList[0].device, scheduleType: data.phoenixsPriceList[0].scheduleType }
  },
  computed: {
    getExtraDetail () {
      const { skuLeftDaysMap } = this.renewDetails
      return Object.keys(skuLeftDaysMap).reduce((a, b) => {
        const next = skuLeftDaysMap[b] ? `${PRODUCT_SOURCE_MAP[b]}剩余${skuLeftDaysMap[b]}天` : ''
        return `${a}${a && skuLeftDaysMap[b] ? '、' : ''}${next}`
      }, '')
    },
    getWelfareInfo () {
      const { currentRenewInfo } = this
      return {
        ...currentRenewInfo,
        duration: currentRenewInfo.days,
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
        return producPrev + Math.floor(f2y(priceB)) * 100
      }, 0)
      return f2y(total + price) || '-'
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
        price,
        sku: o.id,
        duration: getPrice(o).extraDays + days,
        days,
        totalDays: getPrice(o).extraDays + days,
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
          price,
          originPrice: price,
          name: '百度标王标准版',
          ...currentRenewInfo,
          duration: currentRenewInfo.days,
          totalDays: currentRenewInfo.days,
          displayType: 0,
          sku: BAIDU_PRODUCT_SOURCE
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
    citiesFormater (cities) {
      return cities.slice(0, 2).map(city => getCnName(city, this.allAreas)).join(',') + (cities.length > 2 ? `等${cities.length}个城市` : '') || '-'
    },
    async submit () {
      this.isPending = true
      const params = {
        applyId: this.renewDetails.applyId,
        skuList: this.preInfo.additionProductMap
      }
      try {
        const { data: { url } } = await submitPreOrder(params)
        this.$copyText(url).then(async (e) => {
          Message.success('提单链接已复制到剪切板')
          this.$router.push({ name: 'bw-plus-package-list' })
        }, function (e) {})
      } catch (error) {
        console.log(error)
      } finally {
        this.isPending = false
      }
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
      const { phoenixsPriceList, additionRenewDetailList } = this.renewDetails
      const { additionalSkuList } = this
      const targetAdditionRenewProduct = additionRenewDetailList.filter(a => a.extraOriginPrice === 0)
      const target = phoenixsPriceList.find(p => p.device === device && p.scheduleType === scheduleType)
      if (row.duration === 0) {
        this.currentRenewInfo = {
          price: 0,
          device,
          scheduleType,
          days: row.duration
        }
        if (targetAdditionRenewProduct) {
          this.additionalSkuList = additionalSkuList.map(a => {
            if (targetAdditionRenewProduct.find(t => t.sku === a.id)) {
              return { ...a, checked: false }
            }
            return a
          })
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
