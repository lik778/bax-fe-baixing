
<template>
  <span class="qwt-charge-price-list">
    <el-table :data="data" style="width: 440px">
      <el-table-column prop="product" label="购买的产品" width="120" />
      <el-table-column prop="oriPrice" label="原价" width="100" />
      <el-table-column prop="price" label="售价" width="110" />
      <el-table-column prop="realPrice" label="提单价" width="110" />
    </el-table>
  </span>
</template>

<script>

export default {
  name: 'qwt-charge-price-list',
  data() {
    return {
      data: [{}, {}, {}]
    }
  }
}

</script>

<style>

</style>
