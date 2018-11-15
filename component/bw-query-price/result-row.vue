<template>
  <div>
    <span>关键词：</span>
    <span>{value.keyword}</span>
    <el-radio-group>
      <el-radio v-for="(item, index) in Object.entries(value.price)" :key="index" :value="item[0]"></el-radio>
    </el-radio-group>
  </div>
</template>

<script>
  export default {
    name: 'result-row',
    props: {
      value: Object
    }
  }
</script>
