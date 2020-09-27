<template>
  <div class="row">
    <div class="label">推荐{{id + 1}}:</div>
    <div>
      <div class="package-list" v-for="(group, i) in groups">
        <span class="word"><strong>关键词{{ i+ 1 }}</strong>：{{ group.word }}</span>
        <span class="shows" v-if="selectedDeviceList.length">根据过去<strong>90</strong>天，<strong>{{ getWordShows(group) }}</strong>人搜索过（数据来源于历史流量）</span>
      </div>
      <p class="tips" v-if="selectedDeviceList.length">当前<strong>推荐</strong>预计<strong>90</strong>天内将有<strong>{{ getTotalWordShows() }}</strong>人看到您的广告（数据来源于历史流量）</p>
      <el-checkbox-group v-model="selectedDeviceList">
        <el-checkbox v-for="device in Object.keys(deviceObj)" :key="device"
                  class="option" :label="device">{{format(device, deviceObj[device])}}</el-checkbox>
      </el-checkbox-group>
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
    font-size: 18px;
    color: #FF6350;
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
    border-bottom: 1px solid #DCDFE6;
    padding-bottom: 15px;
    & > .word {
      width: 250px;
      margin-right: 30px;
      & strong {
        color: #FF6350;
      }
    }
    & > .shows {
      font-size: 12px;
    }
    & > .shows strong {
      font-size: 18px;
      color: #FF6350;
    }
  }
& .tips {
    font-size: 14px;
    margin-bottom: 20px;
    & strong {
        font-size: 18px;
        color: #FF6350;
    }
  }
}
</style>
