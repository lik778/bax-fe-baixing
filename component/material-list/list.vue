
<template>
  <section>
    <el-table :data="materials" style="width: 100%">
      <el-table-column prop="name" label="名称" width="180">
      </el-table-column>
      <el-table-column prop="materialType" label="类型" width="180">
      </el-table-column>
      <el-table-column prop="slot" label="规格">
      </el-table-column>
      <el-table-column prop="customerId" label="客户">
      </el-table-column>
    </el-table>
  </section>
</template>

<script>

export default {
  name: 'material-list',
  props: {
    materials: {
      type: Array,
      required: true
    }
  }
}

</script>

<style scoped>

section {
  margin-top: 16px;
}

</style>
