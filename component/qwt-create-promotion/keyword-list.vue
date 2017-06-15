
<template>
  <div>
    <el-table :data="words" style="width: 860px"
      @selection-change="onSelectionChange">
      <el-table-column type="selection" width="40" />
      <el-table-column prop="word" label="关键词" width="420" />
      <el-table-column prop="show" label="日均搜索量" width="200" />
      <el-table-column prop="price" label="CPC最高出价 (元/次点击)" width="200"
        :formatter="centToYuan" />
    </el-table>
  </div>
</template>

<script>

import { centToYuan } from 'utils'

export default {
  name: 'qwt-keyword-list',
  props: {
    words: {
      type: Array,
      required: true
    }
  },
  methods: {
    centToYuan({price}) {
      return centToYuan(price)
    },
    onSelectionChange(rows) {
      this.$emit('select-words', rows.map(r => r.word))
    }
  }
}

</script>
