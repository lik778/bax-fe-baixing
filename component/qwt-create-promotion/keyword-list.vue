
<template>
  <div>
    <el-table :data="data" style="width: 860px">
      <el-table-column type="selection" width="40" />
      <el-table-column prop="word" label="关键词" width="420" />
      <el-table-column prop="count" label="日均搜索量" width="200" />
      <el-table-column prop="price" label="CPC最高出价 (元/次点击)" width="200" />
    </el-table>
  </div>
</template>

<script>

export default {
  name: 'qwt-keyword-list',
  // props: {
  //   data: {
  //     type: Array,
  //     required: true
  //   }
  // }
  data() {
    return {
      data: [{
        word: '怎么撩妹',
        count: 456,
        price: 99
      }, {
        word: '棒妹棒棒哒 ~',
        count: 567,
        price: 99
      }, {
        word: '棒哥是怎么傍上棒妹的, 这是一个棒棒的谜 ~',
        count: 678,
        price: 99
      }]
    }
  }
}

</script>
