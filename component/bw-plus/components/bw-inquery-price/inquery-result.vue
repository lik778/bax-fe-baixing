<template>
    <el-table
    border
    type="index"
    :data="tableData"
    :cell-style="{background: '#fff',cursor: 'pointer'}"
    style="width: 100%">
        <el-table-column prop="type">
          <template slot-scope="{ row }">
            {{ row.type }} <el-tag>送店铺</el-tag>
          </template>
        </el-table-column>
        <el-table-column
        label="双端报价"
        prop="both"
        align="center">
            <el-table-column align="center" prop="ST" label="7天*24小时">
                <template slot-scope="{ row }">
                  <div :class="{ 'active-item': row.bothse === selectRow.bothse, 'option-item': true }" @click="cellClick(row)">{{row.bothse}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="bothfe" label="5天*24小时"></el-table-column>
        </el-table-column>
        <el-table-column
        label="手机端报价"
        align="center">
            <el-table-column align="center" prop="wapse" label="7天*24小时"></el-table-column>
            <el-table-column align="center" prop="wapfe" label="5天*24小时"></el-table-column>
        </el-table-column>
        <el-table-column
        label="电脑端报价"
        align="center">
            <el-table-column align="center" prop="pcse" label="7天*24小时"></el-table-column>
            <el-table-column align="center" prop="pcfe" label="5天*24小时"></el-table-column>
        </el-table-column>
    </el-table>
</template>

<script>
import clone from 'clone'
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
      selectRow: ''
    }
  },
  methods: {
    cellClick (row) {
      this.selectRow = clone(row)
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
</style>
