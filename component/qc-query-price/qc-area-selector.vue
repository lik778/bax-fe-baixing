
<template>
  <el-dialog
    :visible="visible"
    :close-on-click-modal="false"
    :before-close="ok"
    :show-close="false"
  >
    <main class="main">
      <div v-for="(province, i) in provinceList" :key="i">
        <el-checkbox class="checkbox-item" :disabled="disabledProvinceCheck(province)" v-model="province.checked" @change="provinceCheckedChange(province)">
          <span :class="{ selected: province.checked }">{{ province.name }}</span>
        </el-checkbox>
      </div>
    </main>
    <header slot="title" class="dialog-header">
      <h5 class="title">区域选择<span>(仅可选择两个地区)</span></h5>
      <div class="buttons">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="ok">确认</el-button>
      </div>
    </header>
  </el-dialog>
</template>

<script>
import isequal from 'lodash.isequal'
import { getAllCities } from "../../api/ka"
import clone from 'clone'

const formatAreaOpts = (data) => {
  if (!Array.isArray(data)) return null

  return data.map(item => {
    return {
      ...item,
      checked: false,
      value: item.name
    }
  })
}

export default {
  name: 'qc-area-selector',
  props: {
    areas: {
      type: Array,
      required: true,
      default: () => []
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      selectedAreas: [...this.areas],
      originSelectedAreas: [],
      originProvinceList: [],
      provinceList: [],
    }
  },
  watch: {
    visible(v) {
      if (v) {
        this.originProvinceList = clone(this.provinceList)
        this.originSelectedAreas = clone(this.originSelectedAreas)
      }
    },
    areas(v) {
      if (isequal(v, this.selectedAreas)) {
        return
      }
      this.selectedAreas = [...v]
    }
  },
  mounted() {
    this.getProvinceData()
    this.$bus.$on('updateQcAreaSelectorView', (province) => {
      const removeProvince = this.selectedAreas.find(x => x.name === province.name)
      removeProvince.checked = false
    })
  },
  methods: {
    async getProvinceData() {
      const blackList = ['m1', 'm6'] // 新疆和西藏去掉
      const allCities = await getAllCities()
      this.provinceList = Object.freeze(formatAreaOpts(allCities)).filter(x => !blackList.includes(x.id))
    },
    disabledProvinceCheck(province) {
      return !this.selectedAreas.map(p => p.name).includes(province.name) && this.selectedAreas.length === 2
    },
    provinceCheckedChange(province) {
      if (province.checked) {
        this.selectedAreas.push(province)
      } else {
        const index = this.selectedAreas.findIndex(x => province.name === x.name)
        if (index > -1) {  this.selectedAreas.splice(index, 1)  }
      }
    },
    cancel() {
      this.provinceList = this.originProvinceList
      this.selectedAreas = this.originSelectedAreas
      this.$emit('cancel')
    },
    ok() {
      const areas = this.selectedAreas.concat([])
      this.$emit('ok', [...areas])
    }
  }
}
</script>

<style lang="postcss" scoped>

.tip {
  color: red;
  font-size: 11px;
}

.dialog-header {
  width: 100%;
  display: flex;
  text-align: center;
  line-height: 40px;
& .title {
    text-indent: 10px;
    font-size: 18px;
    color: #565656;
    & span {
      font-size: 14px;
    }
  }
& .buttons {
    margin-left: auto;
    margin-right: 26px;
  }
}

.main:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}

.checkbox-item {
  width: 120px;
  float: left;
  display: inline-block;
  margin-bottom: 20px;
}
</style>
