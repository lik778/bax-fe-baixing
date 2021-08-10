<template>
    <el-table border :data="tableData" style="width: 100%">
        <el-table-column prop="keyword" label="关键词" />
        <el-table-column prop="frontSoldDevice" label="平台" :formatter="deviceFormatter" />
        <el-table-column label="售出城市">
            <template slot-scope="{ row }">
                {{ citiesFormater(row) }}
                <el-popover
                    placement="top-start"
                    title="已售出城市"
                    width="150"
                    trigger="hover"
                    >
                        <div class="cities-content">{{citiesAllFormater(row)}}</div>
                        <el-button slot="reference" type="text">查看</el-button>
                    </el-popover>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import { DEVICE } from 'constant/bw-plus'
import { getCnName } from 'util'
import clone from 'clone'
export default {
  name: 'sold-city',
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
    }
  }
}
</script>
