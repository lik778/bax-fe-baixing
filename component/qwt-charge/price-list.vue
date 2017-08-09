
<template>
  <span class="qwt-charge-price-list">
    <el-table :data="products" empty-text="暂未选中任何产品">
      <el-table-column prop="name" label="购买的产品" width="120">
      </el-table-column>
      <el-table-column label="原价" width="100"
        :formatter="r => centToYuan(r.originalPrice)">
      </el-table-column>
      <el-table-column label="现价" width="110"
        :formatter="r => centToYuan(r.price)">
      </el-table-column>
      <el-table-column v-if="hasDiscount"
        label="提单价" width="110"
        :formatter="r => (r.discountPrice / 100).toFixed(2)">
      </el-table-column>
    </el-table>
  </span>
</template>

<script>
import { centToYuan } from 'utils'

export default {
  name: 'qwt-charge-price-list',
  props: {
    products: {
      type: Array,
      required: true
    },
    hasDiscount: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    centToYuan
  }
}
</script>

<style>

</style>
