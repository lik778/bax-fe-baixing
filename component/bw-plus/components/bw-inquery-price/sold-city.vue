<template>
  <div>
    <el-table border :data="tableData" style="width: 100%">
        <el-table-column prop="keyword" label="关键词" />
        <el-table-column prop="frontSoldDevice" label="平台" :formatter="deviceFormatter" />
        <el-table-column label="售出城市">
            <template slot-scope="{ row }">
                {{ citiesFormater(row) }}
                <el-button @click="viewCityDetai(row)" type="text">查看</el-button>
            </template>
        </el-table-column>
    </el-table>
    <ProvinceCityMap title="已售城市" @cancel="dialogCityVisible = false" :dialogCityVisible="dialogCityVisible" :allAreas="allAreas" :cities="currentRow.frontSoldCities"/>
  </div>
</template>

<script>
import ProvinceCityMap from '../common/province-city-map.vue'
import { DEVICE } from 'constant/bw-plus'
import { getCnName } from 'util'
import clone from 'clone'
export default {
  name: 'sold-city',
  components: { ProvinceCityMap },
  props: {
    tableData: {
      type: Array,
      default: () => [],
      require: true
    },
    allAreas: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data () {
    return {
      currentRow: {},
      dialogCityVisible: false
    }
  },
  methods: {
    deviceFormatter (...args) {
      const [,, device] = args
      return DEVICE[device]
    },
    citiesFormater (row) {
      const { frontSoldCities } = clone(row)
      const length = frontSoldCities.length
      return length > 2 ? `${frontSoldCities.splice(0, 2).map(city => getCnName(city, this.allAreas)).join('、')}等${length}个城市` : frontSoldCities.map(city => getCnName(city, this.allAreas)).join('、')
    },
    citiesAllFormater (row) {
      const { frontSoldCities } = row
      return frontSoldCities.map(city => getCnName(city, this.allAreas)).join('、')
    },
    viewCityDetai (row) {
      this.currentRow = row
      this.dialogCityVisible = true
    }
  }
}
</script>
