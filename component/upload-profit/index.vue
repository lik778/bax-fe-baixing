<template>
  <main class="wrapper">
    <topbar :userInfo="userInfo">
      <label slot="title">上传业绩</label>
    </topbar>
    <el-row>
      <el-col :span="12">
        <upload-form></upload-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <data-table class="data-table"></data-table>
      </el-col>
    </el-row>
  </main>
</template>

<script>
  import UploadForm from './UploadForm'
  import DataTable from './DataTable'
  import Topbar from 'com/topbar'

  export default {
    name: 'upload-profit',
    props: {
      userInfo: {
        type: Object,
        required: true
      }
    },
    components: {
      UploadForm,
      DataTable,
      Topbar
    }
  }
</script>

<style scoped>
  .wrapper {
    padding: 0 35px;
    width: 100%;
  }
  .data-table {
    margin-bottom: 50px;
  }
</style>
