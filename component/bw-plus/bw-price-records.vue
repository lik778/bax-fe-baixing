<template>
  <el-card class="bw-price-record">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="关键词/ID：">
        <el-input v-model="formInline.keywordId" placeholder="关键词/ID："></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select size="medium" v-model="formInline.status" placeholder="请选择">
          <el-option
            v-for="item in options"
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
      <el-table-column fixed prop="date" label="日期" />
      <el-table-column fixed prop="keyword" label="关键词" />
      <el-table-column prop="type" label="报价类型" />
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
const PAGEAIZE = 10
export default {
  name: 'bw-plus-price-records',
  data () {
    return {
      formInline: {
        keywordId: '',
        status: ''
      },
      records: [],
      total: 0,
      PAGEAIZE,
      currentPage: 0,
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }]
    }
  },
  methods: {
    handleSizeChange () {

    },
    handleCurrentChange () {

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
