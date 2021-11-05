<template>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="日期" :formatter="dateFormater" />
      <el-table-column prop="show" label="展示数（次）" />
      <el-table-column prop="click" label="点击数（次）" />
      <el-table-column prop="ctr" label="点击率（%）" />
      <el-table-column prop="avgClickCost" label="平均点击单价（元）" :formatter="ftyFormatter" />
      <el-table-column prop="avgShowCost" label="平均千次展现费用（元）" :formatter="ftyFormatter"/>
      <el-table-column prop="cost" label="消耗（元）" :formatter="ftyFormatter" />
      <el-table-column prop="convert" label="转化数（次）" />
      <el-table-column prop="convertCost" label="平均转化成本（元）" :formatter="ftyFormatter" />
      <el-table-column prop="convertRate" label="转化率（%）" />
    </el-table>
</template>
<script>
import { f2y } from 'util'
import dayjs from 'dayjs'
export default {
  name: 'cost-list',
  props: {
    tableData: {
      type: Array,
      default: () => [],
      require: false
    }
  },
  methods: {
    ftyFormatter (...args) {
      const [, , y] = args
      return f2y(y)
    },
    dateFormater (...args) {
      const [,, cellValue] = args
      return dayjs(cellValue * 1000).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>
