<template>
    <div>
        <el-table :data="data">
            <el-table-column prop="id" label="Id"/>
            <el-table-column prop="name" label="昵称" align="center" />
            <el-table-column prop="mobile" label="手机" align="center" />
            <el-table-column prop="email" label="邮箱" />
            <el-table-column prop="baixing_id" label="百姓id" align="center" />
            <el-table-column prop="role" label="角色" align="center" />
            <el-table-column label="操作">
                <template slot-scope="{ row }"  >
                <el-button type="text" @click="editRole(row)">修改角色</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-drawer
        title="修改用户角色"
        :visible.sync="drawer"
        direction="rtl"
        >
        </el-drawer>
    </div>
</template>
<script>

export default {
  name: 'userTable',
  data () {
    return {
      drawer: false
    }
  },
  props: {
    data: {
      type: Array,
      require: true,
      default: () => []
    }
  },
  methods: {
    editRole (row) {
      console.log(row)
      this.drawer = true
    }
  }
}
</script>
