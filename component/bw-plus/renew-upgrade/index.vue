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
        </section>
    </div>
</template>

<script>
import { getRenewPriceByPackageId } from 'api/biaowang-plus'
import { Title, BwCreativity } from '../components'
import { BAIDU_BW_PRODUCT_PRICELIST, DEVICE_ALL, DEVICE_WAP, DEVICE_PC } from 'constant/bw-plus'
import { f2y } from 'util'
export default {
  name: 'renew-upgrade',
  components: {
    Title,
    BwCreativity
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
      additionalSkuList: {}
    }
  },
  async mounted () {
    const { packageId } = this.$route.query
    const { data, data: { additionalSkuList } } = await getRenewPriceByPackageId({ packageId })
    this.renewDetails = data
    this.additionalSkuList = additionalSkuList.map(a => ({ ...a, checked: false }))
  },
  methods: {
    transformDeviceAllPrice (row, device, scheduleType) {
      const { duration } = row
      const { phoenixsPriceList } = this.renewDetails
      const target = phoenixsPriceList.find(p => p.device === device && p.scheduleType === scheduleType)
      if (target) {
        const { daysPriceList } = target
        const cellValue = daysPriceList.find(d => d.days === duration)
        return { ...cellValue, allowRenew: true }
      }
      return {
        allowRenew: false
      }
    },
    cellClick (row, device, scheduleType) {
      if (device === this.currentRenewInfo.device && scheduleType === this.currentRenewInfo.scheduleType && row.duration === this.currentRenewInfo.days) {
        this.currentRenewInfo = {}
        return
      }
      const { phoenixsPriceList } = this.renewDetails
      const target = phoenixsPriceList.find(p => p.device === device && p.scheduleType === scheduleType)
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
