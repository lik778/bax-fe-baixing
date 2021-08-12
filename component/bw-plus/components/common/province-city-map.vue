<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{title}}</span>
    </div>
    <ul>
      <li v-for="(item, index) in province" :key="index">
        <span>{{item.label}}</span>
        <span v-for="(city, index) in cityInfo" :key="index">{{city.parent === item.value ? city.nameCn : ''}}</span>
      </li>
    </ul>
  </el-card>
</template>

<script>
import { PROVINCE_LIST } from 'constant/bw-plus'
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
    },
    allAreas: {
      type: Array,
      default: () => [],
      require: true
    }
  },
  data () {
    return {
      province: [],
      cityInfo: []
    }
  },
  watch: {
    cities: {
      handler (newV, oldV) {
        if (newV) {
          const cityInfo = this.allAreas.filter(o => newV.includes(o.id))
          const provinceList = cityInfo.map(o => o.parent)
          const currentProvince = [{ label: '直辖市', value: 'china' }, ...PROVINCE_LIST].filter(o => provinceList.includes(o.value))
          this.province = currentProvince
          this.cityInfo = cityInfo
        }
      },
      deep: true,
      immediate: true
    }
  },
  async mounted () {
  },
  methods: {
  }
}
</script>
