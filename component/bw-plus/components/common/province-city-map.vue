<template>
   <el-card class="box-card">
    <div slot="header" class="clearfix">
        <span>{{title}}</span>
    </div>
    <ul>
       <li></li>
    </ul>
    </el-card>
</template>

<script>
export default {
  name: 'province-city-map',
  props: {
    title: {
      type: String,
      default: '投放城市',
      require: true
    },
    cities: {
      type: Array,
      default: () => [],
      require: true
    }
  }
}
</script>
