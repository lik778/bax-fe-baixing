<template>
    <el-table :data="data">
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="角色" />
        <el-table-column prop="oparator" label="创建人" />
        <el-table-column label="操作">
            <template slot-scope="{ row }">
               <el-button type="text" @click="() => console.log(row)">删除</el-button>
               <el-button type="text">修改</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>

export default {
  name: 'roleTable',
  props: {
    data: {
      type: Array,
      require: true,
      default: () => []
    }
  }
}
</script>
