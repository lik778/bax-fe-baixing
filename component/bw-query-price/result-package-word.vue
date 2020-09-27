<template>
  <div class="row">
    <div class="label">词组{{id + 1}}:</div>
    <div>
      <div class="package-list" v-for="group in groups">
        <span class="word">{{ group.word }}</span>
        <span class="shows" v-if="selectedDeviceList.length">根据过去90天，{{ getWordShows(group) }}人搜索过（数据来源于历史流量）</span>
      </div>
      <el-checkbox-group v-model="selectedDeviceList">
        <el-checkbox v-for="device in Object.keys(deviceObj)" :key="device"
                  class="option" :label="device">{{format(device, deviceObj[device])}}</el-checkbox>
      </el-checkbox-group>
      <p class="tips" v-if="selectedDeviceList.length">提示：当前组合预计90天内您将有{{ getTotalWordShows() }}广告展现（数据来源于历史流量）</p>
    </div>
  </div>
</template>

<script>
import {f2y} from 'util'
import {DEVICE} from 'constant/biaowang'

export default {
  name: 'result-device',
  data() {
    return {
      deviceObj: {},
      selectedDevice: null,
      selectedDeviceList: []
    }
  },
  watch: {
    selectedDeviceList(list) {
      if (list.length) {
        const groupSelected = []
        this.groups.forEach(group => {
          const deviceList = group.deviceTypes.filter(g => list.includes(String(g.device)))
          const priceList = deviceList.map((d) => (d.priceList.find(p => p.days === '90')))
          groupSelected.push(...priceList)
        })
        this.$emit('change', groupSelected)
      }
    },
    selected(val) {
      if (val.length === 0) {
        this.selectedDeviceList = []
      }
    }
  },
  props: {
    id: {
      type: Number
    },
    groups: {
      type: Array,
      required: true
    },
    selected: {
      type: Array,
      required: true
    },
  },
  mounted() {
    this.deviceObj = this.groups.reduce((total, current) => {
      current.deviceTypes.forEach(d => {
        if (!total.hasOwnProperty(d.device)) {
          total[d.device] = { price: 0, shows: 0 }
        }
        // hardcode: 这边直接用30天数据x3
        total[d.device]['price'] += (d.price * 3)
        total[d.device]['shows'] += (d.shows * 3)
      })
      return total
    }, {})
  },
  methods: {
    getWordShows(group) {
      if (this.selectedDeviceList.length) {
        const deviceList = group.deviceTypes.filter(x => this.selectedDeviceList.includes(String(x.device)))
        return deviceList.reduce((total, current) => ( total + current.shows ), 0)
      }
    },
    getTotalWordShows() {
      if (this.selectedDeviceList.length) {
        return this.selectedDeviceList.reduce((total, current) => (total + this.deviceObj[current].shows), 0)
      }
    },
    format(device, option) {
      return `${f2y(option.price)} 元 （90天、${DEVICE[device]}）`
    }
  }
}
</script>

<style lang="postcss" scoped>
.row {
& .label {
    color: #999;
    margin-bottom: 15px;
& .keyword {
    display: inline-block;
    vertical-align: top;
    margin-bottom: 10px;
    color: #000;
  }
}
& .package-list {
    margin-bottom: 10px;
    & > .word {
      width: 200px;
      margin-right: 30px;
    }
  }
& .tips {
    margin-top: 20px;
  }
}
</style>
