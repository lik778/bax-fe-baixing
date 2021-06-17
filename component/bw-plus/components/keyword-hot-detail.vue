<template>
    <el-table
    border
    :data="tableData"
    style="width: 100%"
    height="250">
        <el-table-column
        prop="keyword"
        label="关键词">
        </el-table-column>
        <el-table-column
        prop="pcHot"
        label="电脑端热度">
        </el-table-column>
        <el-table-column
        prop="wapHot"
        label="移动端热度">
        </el-table-column>
    </el-table>
</template>

<script>
export default {
  name: 'KeywordHotDetail',
  props: {
    tableData: {
      type: Array,
      default: () => [],
      require: true
    }
  }
}
</script>
