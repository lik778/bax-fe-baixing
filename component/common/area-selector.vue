
<template>
  <el-dialog title="区域选择" v-model="visible"
    :close-on-click-modal="false" size="large"
    @close="cancel">
    <main class="main">
      <div>
        <span @click="clickArea('china')">全国</span>
        <span />
      </div>
      <div>
        <span @click="clickArea('直辖市')">直辖市</span>
        <span>
          <p v-for="city in specialCities" :key="city"
            v-bind:class="{ selected: areaChecked(city.id) }"
            @click="clickArea(city.id)">
            {{ city.label }}
          </p>
        </span>
      </div>
      <div v-for="a in topAreas">
        <span v-bind:class="{ selected: areaChecked(a.id) }"
          @click="clickArea(a.id)">
          {{ a.label }}
        </span>
        <span>
          <p v-for="area in a.areas"
            v-bind:class="{ selected: areaChecked(area.id) }"
            @click="clickArea(area.id)">
            {{ area.label }}
          </p>
        </span>
      </div>
    </main>
    <footer slot="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button @click="ok">确认</el-button>
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
      selectedAreas: this.areas
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
        .find(a => a.name === name)

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
    removeCityFromChina(city) {
      let result = []

      const parent = this.getParentName(city)

      const topAreas = clone(this.topAreas)

      if (specialCities.includes(city)) {
        return [
          ...specialCities.filter(a => a !== city),
          ...topAreas.map(a => a.id)
        ]
      }

      result = [
        ...specialCities,
        ...topAreas.filter(a => a.id !== parent).map(a => a.id)
      ]

      const topArea = topAreas.find(a => a.id === parent)

      result = [
        ...result,
        ...topArea.areas.filter(a => a.id !== city)
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

      const c = selectedAreas.find(a => a === 'china')
      if (c) {
        // 全国
        return true
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
    clickArea(name) {
      const { selectedAreas } = this

      if (name === 'china') {
        // 全国
        if (selectedAreas.includes('china')) {
          this.selectedAreas = []
        } else {
          this.selectedAreas = ['china']
        }

        return
      }

      if (name === '直辖市') {
        // 直接点击 直辖市 按钮
        if (selectedAreas.includes('china')) {
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

        return
      }

      const area = this.getAreaByName(name)
      const {
        parent,
        level,
        id
      } = area

      // type - add, del
      const type = this.areaChecked(name) ? 'del' : 'add'

      if (level === 2) {
        // 省

        if (type === 'add') {
          this.selectedAreas = [
            ...selectedAreas.filter(a => {
              return !this.belongToProvince(a, id)
            }),
            id
          ]
        } else {
          // del
          if (selectedAreas.includes('china')) {
            this.selectedAreas = [
              ...this.topAreas()
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

        return
      }

      if (level === 1) {
        // 市
        if (type === 'add') {
          this.selectedAreas = [
            ...selectedAreas,
            id
          ]
        } else {
          // del
          const parent = this.getParentName(id)

          if (selectedAreas.includes('china')) {
            this.selectedAreas = this.removeCityFromChina(id)
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

        return
      }
    },
    empty() {
      this.selectedAreas = []
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
  computed: {
    china() {
      const q = this.allAreas.find(a => a.name === 'china') || {}

      return {
        label: q.nameCn,
        id: q.name,
        parent: '',
        level: 0
      }
    },
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
  updated() {
    console.debug('area selector updated')
  }
}

</script>

<style scoped>

@import './selector';

</style>
