<template>
  <div>
    <span class="label">关键词：</span><span class="keyword">{{options[0].word}}</span>
    <el-radio-group :value="selected.find(i => i.word === options[0].word)" @input="v => $emit('change', v)">
      <el-radio v-for="(option, index) in options" :key="index"
        class="option" :label="option">{{format(option)}}</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
  import {f2y} from 'util'

  export default {
    name: 'result-row',
    props: {
      options: Array,
      selected: Array
    },
    methods: {
      format(option) {
        return  `${f2y(option.price)} 元 ( ${option.days} 天 )`
      },
      onChange(checked) {
        if (checked) {

        }
      }
    }
  }
</script>

<style lang="postcss" scoped>
.keyword {
  display: inline-block;
  width: 140px;
}
.label {
  color: #999;
}
.option {
  width: 150px;
}
</style>
