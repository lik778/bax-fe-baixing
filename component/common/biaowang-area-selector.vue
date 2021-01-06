
<template>
  <el-dialog
    :visible="visible"
    :close-on-click-modal="false"
    :before-close="cancel"
    :show-close="false"
  >
    <main class="main">
        <div v-for="(province, i) in topAreas" :key="i">
          <el-checkbox class="checkbox-item" v-model="province.checked" @change="provinceCheckedChange(province)">
            <span :class="{ selected: province.checked }">{{ province.label }}</span>
          </el-checkbox>
          <span>
            <p v-for="(area, i) in province.areas" :key="i"
               :class="{ selected: area.checked }"
               @click="cityChecked(area)">
                {{ area.label }}
            </p>
          </span>
        </div>
        <div>
          <el-checkbox class="checkbox-item" v-model="quanguoChecked" @change="quanguoCheckedChange()">
            <span>全国</span>
          </el-checkbox>
          <span></span>
        </div>
    </main>
    <header slot="title" class="dialog-header">
      <h5 class="title">区域选择</h5>
      <div class="buttons">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="ok">确认</el-button>
      </div>
    </header>
  </el-dialog>
</template>

<script>
import isequal from 'lodash.isequal'

const specialCities = [
  'beijing',
  'tianjin',
  'shanghai',
  'chongqing'
]

/**
 * 说明:
 *   百姓网 ~ quanguo vs china
 *     - quanguo (全国), 选中所有 省, 城市
 *     - china (中国), china.baixing.com
 *   搜索通 ~ quanguo === china
 *     - 需要调用方 quanguo -> china
 */

export default {
  name: 'area-selector',
  props: {
    enableChina: {
      type: Boolean,
      default: true
    },
    allAreas: {
      type: Array,
      required: true
    },
    areas: {
      type: Array,
      required: true,
      default: () => []
    },
    visible: {
      type: Boolean,
      required: true
    },
    type: {
      type: String
    }
  },
  data() {
    return {
      selectedAreas: [...this.areas],
      quanguoChecked: false,
      cityProvinceMapping: {},
      topAreas: []
    }
  },
  watch: {
    allAreas: {
      immediate: true,
      deep: true,
      handler (values) {
        this.topAreas = [
          {
            checked: false,
            id: "zhixiashi",
            label: "直辖市",
            level: 2,
            parent: "china",
            areas:  values
              .filter(a => a.areaType === 1)
              .filter(a => specialCities.includes(a.name))
              .map(a => ({
                label: a.nameCn,
                id: a.name,
                parent: 'zhixiashi',
                level: 1,
                checked: false,
                areas: this.getSubAreas(a.name)
              }))
          },
          ...values
          .filter(a => a.areaType === 2)
          .map(a => ({
            parent: a.parent,
            label: a.nameCn,
            id: a.name,
            level: 2,
            checked: false,
            areas: this.getSubAreas(a.name)
          }))]
        // 城市和city 完成mapping
        values.forEach(v => {
          this.cityProvinceMapping[v.id] = specialCities.includes(v.id) ? 'zhixiashi' : v.parent
        })
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
    // 处理删除选择城市view刷新
    this.$bus.$on('updateBiaowangAreaSelectorView', (cityId) => {
      const provinceId = this.cityProvinceMapping[cityId]
      const provinceItem = this.topAreas.find(x => x.id == provinceId)
      provinceItem.checked = false
      const cityItem = provinceItem.areas.find(x => x.id == cityId)
      cityItem.checked = false
      this.quanguoChecked = false
    })
  },
  methods: {
    quanguoCheckedChange() {
      this.selectedAreas = []
      this.topAreas.forEach(p => {
          p.checked = this.quanguoChecked
          p.areas.forEach(c => {
            c.checked = this.quanguoChecked
            if (this.quanguoChecked) {
              this.selectedAreas.push(c.id)
            }
          })
      })
    },
    provinceCheckedChange(province) {
      province.areas.forEach(x => {
        const { id } = x
        x.checked = province.checked
        if (province.checked) {
          if (!this.selectedAreas.includes(id)) {
            this.selectedAreas.push(id)
          }
        } else {
          if (this.selectedAreas.includes(id)) {
            const deleteIndex = this.selectedAreas.findIndex(x => x === id)
            this.selectedAreas.splice(deleteIndex, 1)
          }
        }
      })
      this.setQuanguoChecked()
    },
    cityChecked(area) {
      const { parent, id } = area
      const province = this.topAreas.find(x => x.id == parent)
      area.checked = !area.checked
      province.checked = (province.areas.filter(x => x.checked).length === province.areas.length)
      this.setQuanguoChecked()
      if (area.checked) {
        this.selectedAreas.push(id)
      } else {
        const index = this.selectedAreas.findIndex(y => y == id)
        this.selectedAreas.splice(index, 1)
      }
    },
    setQuanguoChecked() {
      this.quanguoChecked = (this.topAreas.filter(x => x.checked).length === this.topAreas.length)
    },
    getSubAreas(name) {
      return this.allAreas
        .filter(a => {
            return !!a.baiduCode && a.isAllowed === 1
        })
        .filter(a => a.parent === name)
        .map(a => ({ parent: a.parent, label: a.nameCn,
          id: a.name, level: 1, checked: false }))
    },
    cancel() {
      this.$emit('cancel')
    },
    ok() {
        const areas = this.selectedAreas.concat([])
        this.$emit('ok', [...areas])
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./selector";

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
  }
  & .buttons {
    margin-left: auto;
    margin-right: 26px;
  }
}

.checkbox-item {
  flex: 1;
}
</style>
