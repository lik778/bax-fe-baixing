<template>
    <el-table
    border
    :data="tableData"
    :cell-style="{background: '#fff', cursor: 'pointer'}"
    style="width: 100%">
        <el-table-column prop="type"></el-table-column>
        <el-table-column
        label="双端报价"
        align="center">
            <el-table-column align="center" label="7天*24小时">
                <template slot-scope="{ row }">
                    <span :class="row.bothse === selectRow.bothse && 'price-item'" @click="cellClick(row)">{{row.bothse}}</span>
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
      this.selectRow = row
    }
  }
}
</script>

<style lang="scss" scoped>
    .el-table tbody tr:hover>td {
        background-color:#fff !important
    }
</style>
