<template>
  <el-card class="bw-price-record">
    <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
      <el-form-item label="关键词/ID：" prop="id">
        <el-input v-model="formInline.id" placeholder="关键词/ID："></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select size="medium" v-model="formInline.status" placeholder="请选择">
          <el-option
            v-for="item in Object.keys(APPLY_AUDIT_STATUS_OPTIONS)"
            :key="item"
            :label="APPLY_AUDIT_STATUS_OPTIONS[item]"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="search">查询</el-button>
        <el-button type="primary" size="small" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      style="width: 90%"
      :data="records"
      v-loading="loading"
    >
      <el-table-column align="center" fixed prop="id" label="ID" />
      <el-table-column align="center" fixed prop="createdTime" width="120" label="日期" :formatter="dateFormater" />
      <el-table-column align="center" fixed prop="keywords" label="关键词">
        <template slot-scope="{ row }">
          {{ row.keywords.join("、") }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="applyType" label="报价类型" :formatter="applyTypeFormatter" />
      <el-table-column align="center" prop="status" label="审核状态" :formatter="statusFormatter" />
      <el-table-column align="center" prop="device" label="平台" :formatter="deviceFormatter" />
      <el-table-column align="center" prop="cities" width="200" label="投放城市" :formatter="citiesFormater" />
      <el-table-column align="center" width="120" prop="scheduleType" label="推广时段" :formatter="scheduleTypeFormater" />
      <el-table-column align="center" prop="days" label="服务时长" :formatter="daysFormater" />
      <el-table-column align="center" width="100" prop="industry" label="推广行业" />
      <el-table-column align="center" fixed="right" label="报价">
        <template slot-scope="{ row }">
          <span v-if="row.applyType === APPLY_TYPE_NORMAL">{{f2y(row.price)}}元</span>
          <el-button v-else type="text">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作">
        <template slot-scope="{ row }">
          <el-button :disabled="row.tradeSeq" type="text">提单</el-button>
        </template>
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
import { APPLY_AUDIT_STATUS_OPTIONS, APPLY_TYPE_NORMAL, DEVICE, SCHEDULE_TYPE, SERVICE_DAYS } from 'constant/bw-plus'
import { f2y, getCnName } from 'util'
const PAGEAIZE = 10
export default {
  name: 'bw-plus-price-records',
  props: {
    allAreas: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      loading: true,
      formInline: {
        id: '',
        status: ''
      },
      f2y,
      APPLY_TYPE_NORMAL,
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
    async search () {
      this.currentPage = 0
      await this.getRecord()
    },
    daysFormater (row, column, days, index) {
      return SERVICE_DAYS[days] || '-'
    },
    scheduleTypeFormater (row, column, cellValue, index) {
      return SCHEDULE_TYPE[cellValue] || '-'
    },
    applyTypeFormatter (row, column, cellValue, index) {
      return cellValue === APPLY_TYPE_NORMAL ? '系统报价' : '人工报价'
    },
    dateFormater (row, column, cellValue, index) {
      return cellValue.split('T')[0] || '-'
    },
    priceFormatter (row, column, cellValue, index) {
      return `${f2y(cellValue)}元`
    },
    statusFormatter (row, column, cellValue, index) {
      return APPLY_AUDIT_STATUS_OPTIONS[cellValue] || '-'
    },
    deviceFormatter (row, column, cellValue, index) {
      return DEVICE[cellValue] || '-'
    },
    citiesFormater (row, column, cities, index) {
      return cities.slice(0, 20).map(city => getCnName(city, this.allAreas)).join(',') + (cities.length > 20 ? `等${cities.length}个城市` : '') || '-'
    },
    handleCurrentChange () {

    },
    reset () {
      console.log(this.$refs.formInline)
      this.$refs.formInline.resetFields()
    },
    async getRecord () {
      this.loading = true
      const { formInline, currentPage } = this
      const params = {
        ...formInline,
        size: PAGEAIZE,
        page: currentPage
      }
      try {
        const { data: { content } } = await getInqueryList(params)
        this.records = content
        this.loading = false
      } catch (error) {
        this.loading = false
      } finally {
        this.loading = false
      }
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
