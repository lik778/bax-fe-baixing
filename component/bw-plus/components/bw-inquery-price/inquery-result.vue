<template>
    <el-table
    border
    type="index"
    :data="tableData"
    :cell-style="{background: '#fff',cursor: 'pointer'}"
    style="width: 100%">
        <el-table-column prop="type">
          <template slot-scope="{ row }">
            {{ row.type }}天 <el-tag v-if="row.type > 30">送店铺</el-tag>
          </template>
        </el-table-column>
        <el-table-column
        label="双端报价"
        prop="both"
        align="center">
            <el-table-column align="center" prop="bothSeven" label="7天*24小时（元）">
                <template slot-scope="{ row }">
                  <div :class="{ 'active-item': row.bothSeven.index === current.index, 'option-item': true }" @click="cellClick(row.bothSeven)">{{f2y(row.bothSeven.price)}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="bothFive" label="5天*24小时（元）">
              <template slot-scope="{ row }">
                <div :class="{ 'active-item': row.bothFive.index === current.index, 'option-item': true }" @click="cellClick(row.bothFive)">{{f2y(row.bothFive.price)}}</div>
              </template>
            </el-table-column>
        </el-table-column>
        <el-table-column
        label="手机端报价"
        align="center">
            <el-table-column align="center" prop="wapSeven" label="7天*24小时（元）">
              <template slot-scope="{ row }">
                <div :class="{ 'active-item': row.wapSeven.index === current.index, 'option-item': true }" @click="cellClick(row.wapSeven)">{{f2y(row.wapSeven.price)}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="wapFive" label="5天*24小时（元）">
              <template slot-scope="{ row }">
                <div :class="{ 'active-item': row.wapFive.index === current.index, 'option-item': true }" @click="cellClick(row.wapFive)">{{f2y(row.wapFive.price)}}</div>
              </template>
            </el-table-column>
        </el-table-column>
        <el-table-column
        label="电脑端报价"
        align="center">
            <el-table-column align="center" prop="pcSeven" label="7天*24小时（元）">
              <template slot-scope="{ row }">
                <div :class="{ 'active-item': row.pcSeven.index === current.index, 'option-item': true }" @click="cellClick(row.pcSeven)">{{f2y(row.pcSeven.price)}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="pcFive" label="5天*24小时（元）">
              <template slot-scope="{ row }">
                <div :class="{ 'active-item': row.pcFive.index === current.index, 'option-item': true }" @click="cellClick(row.pcFive)">{{f2y(row.pcFive.price)}}</div>
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
    }
  },
  data () {
    return {
      current: this.tableData[0].bothSeven,
      f2y
    }
  },
  methods: {
    cellClick (value) {
      this.current = value
      this.$emit('getValue', value)
    }
  },
  mounted () {
    this.cellClick(this.current)
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
</style>
