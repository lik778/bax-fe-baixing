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
            <el-form :model="followForm" :rules="rules" ref="form">
                <el-form-item prop="remark">
                    <el-input v-model="followForm.remark" placeholder="请录入跟进记录，限制0-20字" type="textarea"></el-input>
                </el-form-item>
            </el-form><p class="text">提示保存后将更新上次的记录</p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submenu('form')">确 定</el-button>
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
      rowList: [],
      followForm: {
        id: '',
        remark: ''
      },
      rules: {
        remark: [
          { min: 0, max: 20, message: '不能超过20字符', trigger: 'blur' }
        ]
      }
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
      this.followForm.remark = row.remark
      this.followForm.id = row.id
    },
    async submenu (from) {
      this.$refs[from].validate(async (valid) => {
        if (valid) {
          await remarkEdit(this.followForm)
          this.dialogFormVisible = false
          this.$emit('getList')
        }
      })
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
    font-size: 12px;
  }
}
</style>
