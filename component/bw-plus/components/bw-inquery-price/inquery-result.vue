<template>
    <el-table
    border
    header-row-class-name="thead-row"
    type="index"
    :data="tableData"
    :cell-style="{background: '#fff',cursor: 'pointer'}"
    style="width: 100%">
        <el-table-column prop="type">
          <template slot-scope="{ row }">
            {{ row.type }}天 <el-tag class="tag-type" effect="dark" v-if="row.type > 30">送店铺</el-tag>
          </template>
        </el-table-column>
        <el-table-column
        label="双端报价"
        prop="both"
        align="center">
            <el-table-column align="center" prop="bothSeven" label="7天*24小时（元）">
                <template slot-scope="{ row }">
                  <el-popover
                    v-if="clickDisabled(row.bothSeven.price, deviceAvailableStatus.ifAllAvailable)"
                    placement="top-start"
                    title="提示"
                    width="200"
                    trigger="hover"
                    :content="row.bothSeven.price >= 0 ? '部分词的部分城市已售出' : '双端暂无报价'">
                    <span class="sold-item" slot="reference">{{transforPrice(row.bothSeven.price)}}</span>
                  </el-popover>
                  <div v-else :class="{ 'active-item': row.bothSeven.index === current.index, 'option-item': true }" @click="cellClick(row.bothSeven)">{{transforPrice(row.bothSeven.price)}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="bothFive" label="5天*8小时（元）">
              <template slot-scope="{ row }">
                <el-popover
                    v-if="clickDisabled(row.bothFive.price, deviceAvailableStatus.ifAllAvailable)"
                    placement="top-start"
                    width="200"
                    title="提示"
                    trigger="hover"
                    :content="row.bothFive.price >= 0 ? '部分词的部分城市已售出' : '双端暂无报价'">
                    <span class="sold-item" slot="reference">{{transforPrice(row.bothFive.price)}}</span>
                </el-popover>
                <div v-else :class="{ 'active-item': row.bothFive.index === current.index, 'option-item': true }" @click="cellClick(row.bothFive)">{{transforPrice(row.bothFive.price)}}</div>
              </template>
            </el-table-column>
        </el-table-column>
        <el-table-column
        label="手机端报价"
        align="center">
            <el-table-column align="center" prop="wapSeven" label="7天*24小时（元）">
              <template slot-scope="{ row }">
                <el-popover
                    v-if="clickDisabled(row.wapSeven.price, deviceAvailableStatus.ifMobileAvailable)"
                    placement="top-start"
                    width="200"
                    title="提示"
                    trigger="hover"
                    :content="row.wapSeven.price >= 0 ? '部分词的部分城市手机端已售出' : '手机端暂无报价'">
                    <span class="sold-item" slot="reference">{{transforPrice(row.wapSeven.price)}}</span>
                </el-popover>
                <div v-else :class="{ 'active-item': row.wapSeven.index === current.index, 'option-item': true }" @click="cellClick(row.wapSeven)">{{transforPrice(row.wapSeven.price)}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="wapFive" label="5天*8小时（元）">
              <template slot-scope="{ row }">
                <el-popover
                    v-if="clickDisabled(row.wapFive.price, deviceAvailableStatus.ifMobileAvailable)"
                    placement="top-start"
                    width="200"
                    title="提示"
                    trigger="hover"
                    :content="row.wapFive.price >= 0 ? '部分词的部分城市手机端已售出' : '手机端暂无报价'">
                    <span class="sold-item" slot="reference">{{transforPrice(row.wapFive.price)}}</span>
                </el-popover>
                <div v-else :class="{ 'active-item': row.wapFive.index === current.index, 'option-item': true }" @click="cellClick(row.wapFive)">{{transforPrice(row.wapFive.price)}}</div>
              </template>
            </el-table-column>
        </el-table-column>
        <el-table-column
        label="电脑端报价"
        align="center">
            <el-table-column align="center" prop="pcSeven" label="7天*24小时（元）">
              <template slot-scope="{ row }">
                <el-popover
                    v-if="clickDisabled(row.pcSeven.price, deviceAvailableStatus.ifPcAvailable)"
                    placement="top-start"
                    width="200"
                    title="提示"
                    trigger="hover"
                    :content="row.pcSeven.price >= 0 ? '部分词的部分城市电脑端已售出' : '电脑端暂无报价'">
                    <span class="sold-item" slot="reference">{{transforPrice(row.pcSeven.price)}}</span>
                </el-popover>
                <div v-else :class="{ 'active-item': row.pcSeven.index === current.index, 'option-item': true }" @click="cellClick(row.pcSeven)">{{transforPrice(row.pcSeven.price)}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="pcFive" label="5天*8小时（元）">
              <template slot-scope="{ row }">
                <el-popover
                    v-if="clickDisabled(row.pcFive.price, deviceAvailableStatus.ifPcAvailable)"
                    placement="top-start"
                    width="200"
                    title="提示"
                    trigger="hover"
                    :content="row.pcFive.price >= 0 ? '部分词的部分城市电脑端已售出' : '电脑端暂无报价'">
                    <span class="sold-item" slot="reference">{{transforPrice(row.pcFive.price)}}</span>
                </el-popover>
                <div v-else :class="{ 'active-item': row.pcFive.index === current.index, 'option-item': true }" @click="cellClick(row.pcFive)">{{transforPrice(row.pcFive.price)}}</div>
              </template>
            </el-table-column>
        </el-table-column>
    </el-table>
</template>

<script>
import { f2y } from 'util'
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
    deviceAvailableStatus: {
      type: Object,
      default: () => {},
      require: true
    }
  },
  watch: {
    currentPrice: {
      handler (newV, oldV) {
        if (newV) {
          this.active = newV.duration > 30
          this.current = newV
        }
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      current: this.tableData[0].bothSeven
    }
  },
  methods: {
    cellClick (value) {
      this.current = value
      this.$emit('getValue', value)
    },
    transforPrice (price) {
      if (price >= 0) {
        return f2y(price)
      }
      return '-'
    },
    clickDisabled (price, status) {
      return price <= 0 || !status
    }
  }
}
</script>

<style lang="scss" scoped>
    .el-table tbody tr:hover>td {
      background-color:#fff !important
    }
    .option-item:hover{
      color: #FF6350;
    }
    .active-item{
      width: 100%;
      height: 100%;
      position: relative;
      color: #FF6350;
      display: block;
      &::after{
        content: "\2714";
        position: absolute;
        font-size: 14px;
        color: #fff;
        width: 18px;
        height: 18px;
        border-radius: 100%;
        background: #FF6350;
        text-align: center;
        line-height: 18px;
        right: 0;
        bottom: 0;
      }
    }
    .tag-type{
      border-radius:20px;
      height: 25px;
      line-height: 24px;
    }
    /deep/ .thead-row{
      th{
        background: #fff1e3 !important;
        border-right: 1px solid #ffddd2;
        border-bottom: 1px solid #ffddd2;
        color: #d4a47c;
      }
    }
    .sold-item{
      color: #909399;
    }
</style>
