<template>
  <div class="city-selector">
    <el-cascader
      popper-class="city-selector-popper"
      :options="options"
      v-model="values"
      :props="props"
      size="small"
      clearable
    >
    </el-cascader>
  </div>
</template>

<script>
import {
  getAllCities,
  getAreasByCityId
} from '../../api/ka'

const formatArrayDataOpts = function(data, leaf = false) {
  return data.map(item => ({
    id: item.id,
    label: item.name,
    value: item.name,
    leaf
  }))
}

const formatCitiesOpts = function(data) {
  const getChildrenData = item => {
    if (['北京', '重庆', '上海', '天津'].includes(item.name)) {
      return [{
        id: item.id,
        label: item.name,
        value: item.name,
        children: []
      }]
    } else {
      return formatArrayDataOpts(item.cities)
    }
  }
  
  return data.map(item => {
    return {
      id: item.id,
      disabled: true,
      label: item.name,
      value: item.value,
      children: getChildrenData(item)
    }
  })
}

export default {
  name: 'city-selector',
  data() {
    return {
      props: {
        lazy: true,
        async lazyLoad(node, resolve) {
          let children = null
          if (node.level === 2) {
            children = formatArrayDataOpts(await getAreasByCityId(node.data.id), true)
          }
          resolve(children)
        },
        multiple: true,
        emitPath: false,
        checkStrictly: true
      },

      values: [],
      options: []
    }
  },
  methods: {
    lazyLoad(...args) {
      console.log(args)
    }
  },
  async created() {
    const allCities = await getAllCities()
    this.options = formatCitiesOpts(allCities)
  },
  watch: {
    values(value) {
      console.log(value)
    }
  }
}
</script>

<style lang="postcss">
  .city-selector {
    & .el-cascader {
      width: 500px;
    }
  }
  .city-selector-popper {
    & .el-cascader-panel {
      height: 280px;
    }
  }
</style>
