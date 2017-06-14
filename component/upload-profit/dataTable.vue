<template>
  <div>

    <el-table
      :data="pagedUploads"
      :default-sort = "{prop: 'created_at', order: 'descending'}"
      style="width: 100%">
      <el-table-column
        prop="upload_date"
        :formatter="formatUploadDate"
        sortable
        label="所属日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="product"
        label="产品线"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="client"
        sortable
        label="客户名字">
      </el-table-column>
      <el-table-column
        prop="income"
        sortable
        label="收入">
      </el-table-column>
      <el-table-column
        prop="profit"
        sortable
        label="利润">
      </el-table-column>
      <el-table-column
        prop="created_at"
        sortable
        :formatter="formatCreatedAt"
        label="创建日期">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template scope="scope">
          <el-button
            @click.native.prevent="deleteRow(scope.$index, pagedUploads)"
            type="text"
            size="small">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagenation"
      :page-sizes="[10, 50, 100, 200]"
      layout="total, sizes, prev, pager, next"
      :page-size="pageSize"
      :total="uploads.length"
      :current-page="current"
      @current-change="gotoPage">
    </el-pagination>
  </div>
</template>

<script>
  import { getUploads, deleteUpload } from './action'
  import moment from 'moment'
  import store from './store'

  export default {
    name: 'data-table',
    store,
    data() {
      return {
        pageSize: 10,
        current: 1
      }
    },
    mounted() {
      getUploads()
    },
    methods: {
      deleteRow(index, rows) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return deleteUpload(rows[index].id)
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(console.log)
      },
      gotoPage(no) {
        if(no > this.current) {
          this.current ++
        } else if(no < this.current) {
          this.current --
        }
      },
      formatCreatedAt(row, col) {
        return moment(row.created_at).format('YYYY-MM-DD HH:mm')
      },
      formatUploadDate(row, col) {
        return moment(row.upload_date).format('YYYY-MM-DD')
      }
    },
    computed: {
      pagedUploads() {
        const startIndex = (this.current - 1) * this.pageSize
        return this.uploads.slice(startIndex, startIndex + this.pageSize)
      }
    }
  }
</script>
<style scoped>
  .pagenation {
    margin-top: 20px;
  }
</style>