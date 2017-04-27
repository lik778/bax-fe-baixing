
<template>
  <el-dialog title="区域选择" v-model="visible"
    :close-on-click-modal="false" size="large"
    @close="cancel">
    <main class="main">
      <div>
        <span @click="clickArea({china})">全国</span>
        <span />
      </div>
      <div>
        <span @click="clickArea({ level: '直辖市' })">直辖市</span>
        <span>
          <p v-for="city in specialCities"
            v-bind:class="{ selected: areaChecked(city) }"
            @click="clickArea(city)">
            {{ city.label }}
          </p>
        </span>
      </div>
      <div v-for="a in topAreas">
        <span v-bind:class="{ selected: areaChecked(a) }"
          @click="clickArea(a)">
          {{ a.label }}
        </span>
        <span>
          <p v-for="area in a.areas"
            v-bind:class="{ selected: areaChecked(area) }"
            @click="clickArea(area)">
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

export default {
  name: 'area-selector',
  props: {
    allAreas: {
      type: Array,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      selectedAreas: []
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
          level: 2
        }))
    },
    areaChecked(a) {
      const {
        parent,
        level,
        id
      } = a

      const { selectedAreas } = this

      const c = selectedAreas.find(a => a.id === 'china')
      if (c) {
        // 全国
        return true
      }

      if (level === 1) {
        return !!selectedAreas.find(c => c.id === id)
      }

      if (level === 2) {
        if (specialCities.includes(id)) {
          // 直辖 === 1
          return !!selectedAreas.find(c => c.id === id)
        } else {
          return !!selectedAreas.find(c => c.id === id || c.id === parent)
        }
      }
    },
    clickArea(a) {
console.log(9090, a, '\n\n\n')
      const {
        parent,
        level,
        id
      } = a

      const { selectedAreas } = this
console.log(999, this, '\n\n\n')
      if (level === '直辖市') {
        // 直辖市 按钮
        const allChecked = selectedAreas
          .filter(a => specialCities.includes(a.id))
          .length === 4

        const areas = selectedAreas.filter(a => !specialCities.includes(a.id))

        if (allChecked) {
          this.selectedAreas = [...areas]
        } else {
          this.selectedAreas = [
            ...areas,
            ...this.specialCities.map(c => ({...c}))
          ]
        }

        return
      }

      // type - add, del
      const type = this.areaChecked(a) ? 'del' : 'add'

      if (level === 0) {
        // 全国
        if (type === 'add') {
          this.selectedAreas = ['china']
        } else {
          this.selectedAreas = []
        }

        return
      }


      if (level === 1) {
        // 省

        return
      }

      if (level === 2) {
        // 市
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
          level: 2,

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
          level: 1,

          areas: this.getSubAreas(a.name)
        }))
    }
  }
}

</script>

<style scoped>

@import './selector';

</style>
