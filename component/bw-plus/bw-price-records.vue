<template>
  <el-card class="bw-price-record">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="关键词/ID：">
        <el-input v-model="formInline.id" placeholder="关键词/ID："></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select size="medium" v-model="formInline.status" placeholder="请选择">
          <el-option
            v-for="item in APPLY_AUDIT_STATUS_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small">查询</el-button>
        <el-button type="primary" size="small">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      style="width: 90%"
      :data="records"
    >
      <el-table-column fixed prop="id" label="ID" />
      <el-table-column fixed prop="createdTime" label="日期" />
      <el-table-column fixed prop="keywords" label="关键词">
        <template slot-scope="{ row }">
          {{ row.keywords.join("、") }}
        </template>
      </el-table-column>
      <el-table-column prop="applyType" label="报价类型" @formatter="priceFormatter({ cellValue })" />
      <el-table-column prop="status" label="审核状态" />
      <el-table-column prop="platform" label="平台" />
      <el-table-column prop="city" label="投放城市" />
      <el-table-column prop="time" label="推广时段" />
      <el-table-column prop="serviceTime" label="服务时长" />
      <el-table-column prop="industry" label="推广行业" />
      <el-table-column fixed prop="price" label="报价" />
      <el-table-column fixed="right" label="操作">
        <!-- <template slot-scope="{ row }">
          <el-button type="text">提单</el-button>
        </template> -->
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :hide-on-single-page="true"
      :page-size="PAGEAIZE"
      layout="total, prev, pager, next"
      :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
import { getInqueryList } from 'api/biaowang-plus'
import { APPLY_AUDIT_STATUS_OPTIONS, APPLY_TYPE_NORMAL } from 'constant/bw-plus'
const PAGEAIZE = 10
export default {
  name: 'bw-plus-price-records',
  data () {
    return {
      formInline: {
        id: '',
        status: ''
      },
      PAGEAIZE,
      APPLY_AUDIT_STATUS_OPTIONS,
      records: [],
      total: 0,
      currentPage: 0
    }
  },
  async mounted () {
    await this.getRecord()
  },
  methods: {
    handleSizeChange () {

    },
    priceFormatter (cellValue) {
      return cellValue === APPLY_TYPE_NORMAL ? '系统报价' : '人工报价'
    },
    handleCurrentChange () {

    },
    async getRecord () {
      const { formInline, currentPage } = this
      const params = {
        ...formInline,
        size: PAGEAIZE,
        page: currentPage
      }
      const { data: { content } } = await getInqueryList(params)
      this.records = content
    }
  }
}
</script>

<style lang='scss' scoped>
  .bw-price-record{
    height: 100%;
    background: #fff;
    margin: 10px;
  }
  .label{
    display: inline-block;
    height: 100%;
    line-height: 100%;
    white-space: nowrap;
    display: flex;
    align-items: center;
    font-size: 14px;
  }
  .el-select{
    width: 100%;
  }
  .button-group{
    display: flex;
  }
  .el-row{
    margin-bottom: 30px;
  }
</style>
