
<template>
  <el-dialog title="区域选择" :visible="visible"
    :close-on-click-modal="false" size="large"
    :before-close="ok">
    <main class="main">
      <div>
        <span @click="clickArea('quanguo')">全国</span>
        <span>
          <p v-bind:class="{ selected: areaChecked(china.id) }"
            @click="clickArea(china.id)">
            {{ china.label }}
          </p>
        </span>
      </div>
      <div>
        <span v-bind:class="{ selected: areaChecked('直辖市') }"
          @click="clickArea('直辖市')">
          直辖市
        </span>
        <span>
          <p v-for="city in specialCities" :key="city"
            v-bind:class="{ selected: areaChecked(city.id) }"
            @click="clickArea(city.id)">
            {{ city.label }}
          </p>
        </span>
      </div>
      <div v-for="(a, i) in topAreas" :key="i">
        <span v-bind:class="{ selected: areaChecked(a.id) }"
          @click="clickArea(a.id)">
          {{ a.label }}
        </span>
        <span>
          <p v-for="(area, i) in a.areas" :key="i"
            v-bind:class="{ selected: areaChecked(area.id) }"
            @click="clickArea(area.id)">
            {{ area.label }}
          </p>
        </span>
      </div>
    </main>
    <footer slot="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="ok">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>

const specialCities = [
  'beijing',
  'tianjin',
  'shanghai',
  'chongqing'
]

/**
 * 说明: quanguo vs china
 *   - quanguo (全国), 选中所有 二级城市
 *   - china (中国), china.baixing.com
 */

import isequal from 'lodash.isequal'
import clone from 'clone'

export default {
  name: 'area-selector',
  props: {
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
    }
  },
  data() {
    return {
      selectedAreas: [...this.areas],
      china: {
        label: '中国',
        id: 'china',
        parent: '',
        level: 0
      }
    }
  },
  computed: {
    specialCities() {
      return this.allAreas
        .filter(a => a.areaType === 1)
        .filter(a => specialCities.includes(a.name))
        .map(a => ({
          label: a.nameCn,
          id: a.name,
          parent: '',
          level: 1,

          areas: this.getSubAreas(a.name)
        }))
    },
    topAreas() {
      return this.allAreas
        .filter(a => a.areaType === 2)
        .map(a => ({
          parent: a.parent,
          label: a.nameCn,
          id: a.name,
          level: 2,

          areas: this.getSubAreas(a.name)
        }))
    }
  },
  methods: {
    getSubAreas(name) {
      return this.allAreas
        .filter(a => a.parent === name)
        .map(a => ({
          parent: a.parent,
          label: a.nameCn,
          id: a.name,
          level: 1 // 市
        }))
    },
    getAreaByName(name) {
      const a = this.allAreas
        .find(a => a.name === name) || {}

      return {
        level: a.areaType,
        parent: a.parent,
        label: a.nameCn,
        id: a.name
      }
    },
    getParentName(name) {
      const a = this.getAreaByName(name)
      return a.parent || ''
    },
    removeCityFromQuanguo(city) {
      // 城市: 非 省, china
      let result = []

      const parent = this.getParentName(city)

      const topAreas = clone(this.topAreas)

      if (specialCities.includes(city)) {
        return [
          this.china.id,
          ...specialCities.filter(a => a !== city),
          ...topAreas.map(a => a.id)
        ]
      }

      result = [
        this.china.id,
        ...specialCities,
        ...topAreas.filter(a => a.id !== parent).map(a => a.id)
      ]

      const topArea = topAreas.find(a => a.id === parent)

      result = [
        ...result,
        ...topArea.areas.filter(a => a.id !== city).map(a => a.id)
      ]

      return result
    },
    removeCityFromProvince(city) {
      const parent = this.getParentName(city)

      const topArea = clone(this.topAreas).find(a => a.id === parent)

      return topArea.areas
        .filter(a => a.id !== city)
        .map(a => a.id)
    },
    belongToProvince(city, province) {
      const top = this.topAreas.find(a => a.id === province)
      return top.areas.map(a => a.id).includes(top)
    },
    areaChecked(name) {
      const area = this.getAreaByName(name)

      const {
        parent,
        level,
        id
      } = area

      const { selectedAreas } = this

      const c = selectedAreas.find(a => a === 'quanguo')
      if (c) {
        // 全国
        return true
      }

      if (name === 'china') {
        return selectedAreas.includes('china')
      }

      if (name === '直辖市') {
        const allChecked = selectedAreas
          .filter(a => specialCities.includes(a))
          .length === 4

        return allChecked
      }

      if (level === 2) {
        return !!selectedAreas.find(a => a === id)
      }

      if (level === 1) {
        if (specialCities.includes(id)) {
          // 直辖市
          return !!selectedAreas.find(a => a === id)
        } else {
          return !!selectedAreas.find(a => a === id || a === parent)
        }
      }
    },
    clickSpecialCityButton(name) {
      const { selectedAreas } = this

      if (selectedAreas.includes('quanguo')) {
        return
      }

      const allChecked = selectedAreas
        .filter(a => specialCities.includes(a))
        .length === 4

      const areas = selectedAreas.filter(a => !specialCities.includes(a))

      if (allChecked) {
        this.selectedAreas = [...areas]
      } else {
        this.selectedAreas = [
          ...areas,
          ...specialCities
        ]
      }
    },
    clickProvinceArea(name) {
      const { selectedAreas } = this

      const area = this.getAreaByName(name)
      const { id } = area

      // type - add, del
      const type = this.areaChecked(name) ? 'del' : 'add'

      if (type === 'add') {
        this.selectedAreas = [
          ...selectedAreas.filter(a => {
            return !this.belongToProvince(a, id)
          }),
          id
        ]
      } else {
        // del
        if (selectedAreas.includes('quanguo')) {
          this.selectedAreas = [
            this.china.id,
            ...this.topAreas
              .filter(a => a.id !== id)
              .map(a => a.id),
            ...specialCities
          ]
        } else {
          const areas = selectedAreas
            .filter(a => {
              if (a === id) {
                return false
              }

              const parent = this.getParentName(a)

              if (parent === id) {
                return false
              }

              return true
            })

          this.selectedAreas = [...areas]
        }
      }
    },
    clickCityArea(name) {
      const { selectedAreas } = this

      const area = this.getAreaByName(name)
      const { id } = area

      // type - add, del
      const type = this.areaChecked(name) ? 'del' : 'add'

      if (type === 'add') {
        this.selectedAreas = [
          ...selectedAreas,
          id
        ]
      } else {
        // del
        const parent = this.getParentName(id)

        if (selectedAreas.includes('quanguo')) {
          this.selectedAreas = this.removeCityFromQuanguo(id)
        } else {
          if (selectedAreas.includes(parent)) {
            // 已选中省
            this.selectedAreas = [
              ...selectedAreas.filter(a => a !== parent),
              ...this.removeCityFromProvince(id)
            ]
          } else {
            this.selectedAreas = selectedAreas.filter(a => a !== id)
          }
        }
      }
    },
    clickChina() {
      const type = this.areaChecked('china') ? 'del' : 'add'
      const { selectedAreas } = this

      if (type === 'add') {
        this.selectedAreas = [
          ...selectedAreas,
          'china'
        ]
      } else {
        // del
        if (selectedAreas.includes('quanguo')) {
          this.selectedAreas = [
            ...this.topAreas.map(a => a.id),
            ...specialCities
          ]
        } else {
          this.selectedAreas = selectedAreas.filter(a => a !== 'china')
        }
      }
    },
    clickArea(name) {
      const { selectedAreas } = this

      if (name === 'quanguo') {
        // 全国
        if (selectedAreas.includes('quanguo')) {
          this.selectedAreas = []
        } else {
          this.selectedAreas = ['quanguo']
        }

        return
      }

      if (name === 'china') {
        return this.clickChina()
      }

      if (name === '直辖市') {
        // 直接点击 直辖市 按钮
        return this.clickSpecialCityButton(name)
      }

      const area = this.getAreaByName(name)
      const { level } = area

      if (level === 2) {
        // 省
        return this.clickProvinceArea(name)
      }

      if (level === 1) {
        // 市
        this.clickCityArea(name)
      }
    },
    empty() {
      // 一律由外部 prop 清空
      // this.selectedAreas = []
    },
    cancel() {
      this.empty()
      this.$emit('cancel')
    },
    ok() {
      this.$emit('ok', [...this.selectedAreas])
      this.empty()
    }
  },
  watch: {
    areas(v) {
      if (isequal(v, this.selectedAreas)) {
        return
      }

      this.selectedAreas = [...v]
    }
  },
  updated() {
    console.debug('area selector updated')
  }
}

</script>

<style scoped>

@import './selector';

</style>
