<template>
  <div class="province-container">
    <h2 class="title">{{title}}</h2>
    <ul class="province-content">
      <li v-for="(item, index) in myWatch.currentProvince" class="item" :key="index">
        <span class="province">{{item.label}}</span>
        <p>
          <span class="city" v-for="(city, index) in myWatch.cityInfo.filter(o => o.parent === item.value)" :key="index">
           {{city.nameCn}}
          </span>
        </p>
      </li>
    </ul>
  </div>
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
  computed: {
    myWatch () {
      const { cities, allAreas } = this
      if (cities.length && allAreas.length) {
        const cityInfo = this.allAreas.filter(o => cities.includes(o.id))
        const provinceList = cityInfo.map(o => o.parent)
        const currentProvince = [{ label: '直辖市', value: 'china' }, ...PROVINCE_LIST].filter(o => provinceList.includes(o.value))
        return { cityInfo, currentProvince }
      }
      return {}
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>
<style lang="scss" scoped>
  .province-container{
    .title{
      font-size: 16px;
      color: #606266;
      margin-bottom: 10px;
      padding-bottom: 6px;
      border-bottom: 1px solid #DCDFE6;
    }
  }
  .province-content{
    max-height: 500px;
    overflow-y: auto;
    .item{
      margin-bottom: 25px;
      display: flex;
      align-items: flex-start;
      p{
        border-left: 1px dashed #DCDFE6;
      }
    }
    .province{
      font-size: 14px;
      width: 60px;
      flex-shrink: 0;
      margin-right: 10px;
      padding: 6px;
    }
    .city{
      font-size: 14px;
      margin-right: 10px;
      padding: 6px;
    }
  }
</style>
