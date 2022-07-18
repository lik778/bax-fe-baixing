<template>
  <section>
    <el-table
    border
    :data="tableData"
    style="width: 100%">
        <el-table-column
        prop="word"
        label="关键词">
        </el-table-column>
        <el-table-column
        prop="pcPv"
        label="电脑端热度">
        </el-table-column>
        <el-table-column
        prop="mobilePv"
        label="移动端热度">
        </el-table-column>
    </el-table>
  </section>
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
  },
  watch: {
    tableData: {
      deep: true,
      handler (v) {
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  footer{
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
</style>
