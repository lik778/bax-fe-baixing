<template>
  <div>
    <el-table border :data="tableData" style="width: 100%">
      <el-table-column prop="keyword" label="关键词" />
      <el-table-column prop="skuList" label="渠道" :formatter="skuFormater" />
      <el-table-column
        prop="device"
        label="平台"
        :formatter="deviceFormatter"
      />
      <el-table-column label="售出城市">
        <template slot-scope="{ row }">
          <el-popover placement="right" width="400" trigger="hover">
            <ProvinceCityMap
              title="已售城市"
              :allAreas="allAreas"
              :cities="row.lockCities"
            />
            <span slot="reference">{{ citiesFormater(row) }}</span>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import ProvinceCityMap from '../common/province-city-map.vue'
import { DEVICE, PRODUCT_SOURCE_MAP } from 'constant/bw-plus'
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
  methods: {
    skuFormater (...args) {
      const [, , skuList] = args
      return skuList.map((sku) => PRODUCT_SOURCE_MAP[sku]).join('、')
    },
    deviceFormatter (...args) {
      const [, , device] = args
      return DEVICE[device]
    },
    citiesFormater (row) {
      const { lockCities: frontSoldCities } = clone(row)
      const length = frontSoldCities.length
      if (length >= 362) {
        return '全国'
      }
      return length > 2
        ? `${frontSoldCities
            .splice(0, 2)
            .map((city) => getCnName(city, this.allAreas))
            .join('、')}等${length}个城市`
        : frontSoldCities
          .map((city) => getCnName(city, this.allAreas))
          .join('、')
    },
    citiesAllFormater (row) {
      const { frontSoldCities } = row
      return frontSoldCities
        .map((city) => getCnName(city, this.allAreas))
        .join('、')
    }
  }
}
</script>
