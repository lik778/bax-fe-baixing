
<template>
  <span class="gw-charge-price-list">
    <el-table :data="products" empty-text="暂未选中任何产品"
      style="width: 320px">
      <el-table-column prop="name" label="购买的产品" width="120">
      </el-table-column>
      <el-table-column label="原价" width="100"
        :formatter="r => centToYuan(r.showPrice)">
      </el-table-column>
      <el-table-column prop="price" label="售价"
        :formatter="r => centToYuan(r.price)">
      </el-table-column>
    </el-table>
  </span>
</template>

<script>
import { centToYuan } from 'utils'

export default {
  name: 'gw-charge-price-list',
  props: {
    products: {
      type: Array,
      required: true
    }
  },
  methods: {
    centToYuan
  }
}
</script>
