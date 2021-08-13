<template>
  <el-dialog @close="cancel" :title="title" :visible.sync="dialogCityVisible">
    <ul class="province-content">
      <li v-for="(item, index) in province" class="item" :key="index">
        <h4 class="province">{{item.label}}</h4>
        <p>
          <span class="city" v-for="(city, index) in cityInfo.filter(o => o.parent === item.value)" :key="index">
           {{city.nameCn}}
          </span>
        </p>
      </li>
    </ul>
  </el-dialog>
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
    },
    dialogCityVisible: {
      type: Boolean,
      default: false,
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
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>
<style lang="scss" scoped>
  .province-content{
    .item{
      margin-bottom: 10px;
      display: flex;
      align-items: flex-start;
    }
    .province{
      font-size: 14px;
      width: 60px;
      border-right: 1px dashed #DCDFE6;
      flex-shrink: 0;
      margin-right: 10px;
    }
    .city{
      font-size: 14px;
      margin-right: 10px;
    }
  }
</style>
