<template>
  <el-table
    border
    header-row-class-name="thead-row"
    type="index"
    :data="tableData"
    :cell-style="{ background: '#fff', cursor: 'pointer' }"
    style="width: 100%"
  >
    <el-table-column prop="type">
      <template slot-scope="{ row }">
        <span class="row-day">{{ row.type }}天</span>
        <el-tag class="tag-type" effect="dark" v-if="row.type > 30"
          >送店铺</el-tag
        >
      </template>
    </el-table-column>
    <el-table-column
      label="双端报价"
      prop="both"
      align="center"
      v-if="showDeviceAll"
    >
      <el-table-column
        v-if="showSchedule724"
        align="center"
        prop="bothSeven"
        label="7天*24小时（元）"
      >
        <template slot-scope="{ row }">
          <el-popover
            v-if="clickDisabled(row.bothSeven.price, DEVICE_ALL)"
            placement="top-start"
            title="提示"
            width="200"
            trigger="hover"
            :content="
              row.bothSeven.price >= 0 ? '已售出' : '行业太热，暂无报价'"
          >
            <span class="sold-item" slot="reference">--</span>
          </el-popover>
          <div
            v-else
            :class="{
              'active-item': row.bothSeven.index === current.index,
              'option-item': true
            }"
            @click="cellClick(row.bothSeven)"
          >
          <el-popover
            placement="top-start"
            width="200"
            title="提示"
            :disabled="skipAudit"
            trigger="hover"
            :content="skipAudit? '' : '按照“平台*时段*时长”勾选，具体价格需要人工审核后确定。'"
          >
            <span :class="!skipAudit?'click-item':''" slot="reference">{{ skipAudit?transforPrice(row.bothSeven.price):'—'}}</span>
          </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSchedule58"
        align="center"
        prop="bothFive"
        label="5天*8小时（元）"
      >
        <template slot-scope="{ row }">
          <el-popover
            v-if="clickDisabled(row.bothFive.price, DEVICE_ALL)"
            placement="top-start"
            width="200"
            title="提示"
            trigger="hover"
            :content="row.bothFive.price >= 0 ? '已售出' : '行业太热，暂无报价'"
          >
            <span class="sold-item" slot="reference">--</span>
          </el-popover>
          <div
            v-else
            :class="{
              'active-item': row.bothFive.index === current.index,
              'option-item': true
            }"
            @click="cellClick(row.bothFive)"
          >
          <el-popover
            placement="top-start"
            width="200"
            title="提示"
            trigger="hover"
            :disabled="skipAudit"
            :content="skipAudit? '' : '按照“平台*时段*时长”勾选，具体价格需要人工审核后确定。'"
          >
            <span :class="!skipAudit?'click-item':''" slot="reference">{{ skipAudit?transforPrice(row.bothFive.price):'—'}}</span>
          </el-popover>
          </div>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column label="手机端报价" align="center" v-if="showDeviceWap">
      <el-table-column
        v-if="showSchedule724"
        align="center"
        prop="wapSeven"
        label="7天*24小时（元）"
      >
        <template slot-scope="{ row }">
          <el-popover
            v-if="clickDisabled(row.wapSeven.price, DEVICE_WAP)"
            placement="top-start"
            width="200"
            title="提示"
            trigger="hover"
            :content="row.wapSeven.price > 0 ? '已售出' : '行业太热，暂无报价'"
          >
            <span class="sold-item" slot="reference">--</span>
          </el-popover>
          <div
            v-else
            :class="{
              'active-item': row.wapSeven.index === current.index,
              'option-item': true
            }"
            @click="cellClick(row.wapSeven)"
          >
          <el-popover
            placement="top-start"
            width="200"
            title="提示"
            :disabled="skipAudit"
            trigger="hover"
            :content="skipAudit? '' : '按照“平台*时段*时长”勾选，具体价格需要人工审核后确定。'"
          >
            <span :class="!skipAudit?'click-item':''" slot="reference">{{ skipAudit?transforPrice(row.wapSeven.price):'—'}}</span>
          </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSchedule58"
        align="center"
        prop="wapFive"
        label="5天*8小时（元）"
      >
        <template slot-scope="{ row }">
          <el-popover
            v-if="clickDisabled(row.wapFive.price, DEVICE_WAP)"
            placement="top-start"
            width="200"
            title="提示"
            trigger="hover"
            :content="row.wapFive.price >= 0 ? '已售出' : '行业太热，暂无报价'"
          >
            <span class="sold-item" slot="reference">--</span>
          </el-popover>
          <div
            v-else
            :class="{
              'active-item': row.wapFive.index === current.index,
              'option-item': true
            }"
            @click="cellClick(row.wapFive)"
          >
          <el-popover
            placement="top-start"
            width="200"
            title="提示"
            trigger="hover"
            :disabled="skipAudit"
            :content="skipAudit? '' : '按照“平台*时段*时长”勾选，具体价格需要人工审核后确定。'"
          >
            <span :class="!skipAudit?'click-item':''" slot="reference">{{ skipAudit?transforPrice(row.wapFive.price):'—'}}</span>
          </el-popover>
          </div>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column label="电脑端报价" align="center" v-if="showDevicePc">
      <el-table-column
        v-if="showSchedule724"
        align="center"
        prop="pcSeven"
        label="7天*24小时（元）"
      >
        <template slot-scope="{ row }">
          <el-popover
            v-if="clickDisabled(row.pcSeven.price, DEVICE_PC)"
            placement="top-start"
            width="200"
            title="提示"
            trigger="hover"
            :content="row.pcSeven.price >= 0 ? '已售出' : '行业太热，暂无报价'"
          >
            <span class="sold-item" slot="reference">--</span>
          </el-popover>
          <div
            v-else
            :class="{
              'active-item': row.pcSeven.index === current.index,
              'option-item': true
            }"
            @click="cellClick(row.pcSeven)"
          >
          <el-popover
            placement="top-start"
            width="200"
            title="提示"
            trigger="hover"
            :disabled="skipAudit"
            :content="skipAudit? '' : '按照“平台*时段*时长”勾选，具体价格需要人工审核后确定。'"
          >
            <span :class="!skipAudit?'click-item':''" slot="reference">{{ skipAudit?transforPrice(row.pcSeven.price):'—'}}</span>
          </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSchedule58"
        align="center"
        prop="pcFive"
        label="5天*8小时（元）"
      >
        <template slot-scope="{ row }">
          <el-popover
            v-if="clickDisabled(row.pcFive.price, DEVICE_PC)"
            placement="top-start"
            width="200"
            title="提示"
            trigger="hover"
            :content="row.pcFive.price >= 0 ? '已售出' : '行业太热，暂无报价'"
          >
            <span class="sold-item" slot="reference">--</span>
          </el-popover>
          <div
            v-else
            :class="{
              'active-item': row.pcFive.index === current.index,
              'option-item': true
            }"
            @click="cellClick(row.pcFive)"
          >
          <el-popover
            placement="top-start"
            width="200"
            title="提示"
            :disabled="skipAudit"
            trigger="hover"
            :content="skipAudit? '' : '按照“平台*时段*时长”勾选，具体价格需要人工审核后确定。'"
          >
            <span :class="!skipAudit?'click-item':''" slot="reference">{{ skipAudit?transforPrice(row.pcFive.price):'—'}}</span>
          </el-popover>
          </div>
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>

<script>
import { f2y } from 'util'
import {
  DEVICE_ALL,
  DEVICE_PC,
  DEVICE_THREE,
  DEVICE_WAP
} from 'constant/bw-plus'
export default {
  name: 'InqueryResult',
  props: {
    tableData: {
      type: Array,
      default: () => [],
      require: true
    },
    currentPrice: {
      type: Object,
      default: () => {},
      require: true
    },
    disableDeviceListBySku: {
      type: Object,
      default: () => {},
      require: true
    },
    dealPriceRatio: {
      type: Number,
      default: 1,
      require: false
    },
    limit: {
      type: null || Object,
      default: null,
      require: false
    },
    skipAudit: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      current: this.currentPrice,
      DEVICE_ALL,
      DEVICE_PC,
      DEVICE_WAP,
      DEVICE_THREE
    }
  },
  watch: {
    currentPrice: {
      deep: true,
      immediate: true,
      handler (v) {
        this.current = v
      }
    }
  },
  computed: {
    disableSold () {
      return true
    },
    showDeviceAll () {
      const { limit } = this
      return (
        !limit ||
        (limit &&
          (limit.platform.includes(DEVICE_ALL) ||
            limit.platform[0] === DEVICE_THREE))
      )
    },
    showDevicePc () {
      const { limit } = this
      return (
        !limit ||
        (limit &&
          (limit.platform.includes(DEVICE_PC) ||
            limit.platform[0] === DEVICE_THREE))
      )
    },
    showDeviceWap () {
      const { limit } = this
      return (
        !limit ||
        (limit &&
          (limit.platform.includes(DEVICE_WAP) ||
            limit.platform[0] === DEVICE_THREE))
      )
    },
    showSchedule724 () {
      const { limit } = this
      return !limit || (limit && limit.schedule.includes(724))
    },
    showSchedule58 () {
      const { limit } = this
      return !limit || (limit && limit.schedule.includes(58))
    }
  },
  methods: {
    cellClick (value) {
      const { current } = this
      if (current.index === value.index) {
        this.current = {}
      } else {
        this.current = value
      }
      this.$emit('getValue', this.current)
    },
    transforPrice (price) {
      const { dealPriceRatio } = this
      if (price >= 0) {
        return f2y(dealPriceRatio * price)
      }
      return '-'
    },
    clickDisabled (price, device) {
      const {
        disableDeviceListBySku,
        currentPrice: { skuId }
      } = this
      return (
        price <= 0 ||
        (disableDeviceListBySku[skuId] &&
          disableDeviceListBySku[skuId].includes(device))
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table tbody tr:hover > td {
  background-color: #fff !important;
}
.option-item:hover {
  color: #ff6350;
}
.option-item{
    padding: 10px 0;
}
.active-item {
  width: 100%;
  height: 100%;
  position: relative;
  color: #ff6350;
  display: block;
  &::after {
    content: '\2714';
    position: absolute;
    font-size: 14px;
    color: #fff;
    width: 18px;
    height: 18px;
    border-radius: 100%;
    background: #ff6350;
    text-align: center;
    line-height: 18px;
    right: 0;
    bottom: 0;
  }
}
.tag-type {
  border-radius: 20px;
  height: 25px;
  line-height: 24px;
}
.row-day {
  width: 46px;
}
/deep/ .thead-row {
  th {
    background: #fff1e3 !important;
    border-right: 1px solid #ffddd2;
    border-bottom: 1px solid #ffddd2;
    color: #d4a47c;
  }
}
.sold-item {
  color: #909399;
}
.click-item{
  color: #ff6350;
}
.diabled {
  color: #909399;
  pointer-events: none;
}
</style>
