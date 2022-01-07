<template>
    <div class="ciueCenter">
        <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="日期" :formatter="dateFormater" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="telephone" label="电话" />
        <el-table-column prop="lastFollowTime" label="最后一次跟进时间" :formatter="dateFormater" />
        <el-table-column prop="remark" label="跟进记录"/>
        <el-table-column prop="name" label="操作">
            <template slot-scope="{ row }">
                <el-button type="text" @click="handleedit(row)">跟进</el-button>
            </template>
        </el-table-column>
        </el-table>
        <el-dialog title="录入跟进记录" :visible.sync="dialogFormVisible" width="500px">
            <el-form :model="rowList">
                    <el-input v-model="rowList.remark" placeholder="请录入跟进记录，限制0-20字" type="textarea"></el-input>
                    <p class="text">提示保存后将更新上次的记录</p>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submenu()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import dayjs from 'dayjs'
import { remarkEdit } from 'api/ad-platform'
export default {
  name: 'ciue-center',
  data () {
    return {
      dialogFormVisible: false,
      rowList: []
    }
  },
  props: {
    tableData: {
      type: Array,
      default: () => [],
      require: false
    }
  },
  methods: {
    dateFormater (...args) {
      if (args[2] == null) {
        return ''
      }
      const [,, cellValue] = args
      return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss')
    },
    handleedit (row) {
      this.dialogFormVisible = true
      this.rowList = row
    },
    async submenu () {
      const { id, remark } = this.rowList
      await remarkEdit({ id, remark })
      this.dialogFormVisible = false
      this.$emit('getList')
    }
  }
}
</script>
<style  lang="scss">
.ciueCenter{
  padding-top: 30px;
}
.el-dialog__body{
  padding: 20px 20px 0px 20px;
  .text{
    padding: 10px 0px;
    font-size: 12px;
  }
}
</style>
