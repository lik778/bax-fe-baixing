<template>
  <div class="account-container">
    <main class="container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="用户管理" name="user">
          <el-row :gutter="20">
            <el-col :span="5">
              <el-input
                placeholder="请输入用户昵称"
                prefix-icon="el-icon-search"
                v-model="queryParams.name">
              </el-input>
            </el-col>
            <el-col :span="5">
              <el-input
                placeholder="请输入用户手机"
                prefix-icon="el-icon-search"
                v-model="queryParams.mobile">
              </el-input>
            </el-col>
            <el-col :span="5">
              <el-input
                placeholder="请输入用户邮箱"
                prefix-icon="el-icon-search"
                v-model="queryParams.email">
              </el-input>
            </el-col>
          </el-row>
          <userTable :data="userData"/>
        </el-tab-pane>
        <el-tab-pane label="角色管理" name="role">
          <el-button type="primary">创建角色</el-button>
          <roleTable :data="roleData" />
        </el-tab-pane>
      </el-tabs>
    </main>
  </div>
</template>

<script>
import userTable from './components/userTable'
import roleTable from './components/roleTable'
export default {
  name: 'role',
  components: { userTable, roleTable },
  data () {
    return {
      role: '',
      user: [],
      activeName: 'user',
      queryParams: {
        name: '',
        email: '',
        mobile: ''
      },
      userData: [
        {
          id: 1,
          name: '钟媛媛',
          mobile: '手机',
          email: '2767389215@qq.com',
          baixing_id: 1,
          role: '运营'
        }
      ],
      roleData: [
        {
          id: 1,
          name: '代理商提单员',
          oparator: '钟媛媛'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 9px 0 rgba(83, 95, 127, .10);
  color: #666;
  font-size: 14px;
  .el-row{
    margin-bottom: 20px;
  }
}
</style>
