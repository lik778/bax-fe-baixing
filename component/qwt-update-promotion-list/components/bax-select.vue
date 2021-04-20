<template>
        <el-select
            v-model="value"
            placeholder="请选择"
        >
            <el-option
                v-for="(item, index) in selectOptions"
                :key="index"
                :label="item[labelKey]"
                :value="item[valueKey]"
            >
            </el-option>
        </el-select>
</template>

<script>
export default {
  name: 'bax-select',
  props: {
    title: {
      type: String,
      require: true,
      default: '计划id'
    },
    selectOptions: {
      type: Array,
      require: true,
      default: () => []
    },
    labelKey: {
      type: String,
      require: true,
      default: 'label'
    },
    valueKey: {
      type: String,
      require: true,
      default: 'value'
    }
  },
  data () {
    return {
      value: ''
    }
  }
}
</script>
