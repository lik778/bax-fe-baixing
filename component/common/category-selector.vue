
<template>
  <el-dialog title="类目选择" :value="visible"
    :close-on-click-modal="false" size="large"
    @close="cancel">
    <main class="main">
      <div v-for="c in topCategories">
        <span v-bind:class="{ selected: categoryChecked(c.id) }"
          @click="clickCategory(c.id)">
          {{ c.label }}
        </span>
        <span>
          <p v-for="category in c.categories"
            v-bind:class="{ selected: categoryChecked(category.id) }"
            @click="clickCategory(category.id)">
            {{ category.label }}
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

import isequal from 'lodash.isequal'

export default {
  name: 'category-selector',
  props: {
    allCategories: {
      type: Array,
      required: true
    },
    categories: {
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
      selectedCategories: [...this.categories]
    }
  },
  methods: {
    getMainCategories(topId) {
      return this.allCategories
        .filter(c => c.level === 2 && c.belongsToFirst === topId)
        .map(c => ({
          parent: c.belongsToFirst,
          label: c.nameCn,
          level: 2,
          id: c.id
        }))
    },
    getCategoryByName(id) {
      const c = this.allCategories.find(c => c.name === id)

      return {
        parent: c.belongsToFirst,
        label: c.nameCn,
        level: c.level,
        id: c.id
      }
    },
    categoryChecked(id) {
      const category = this.getCategoryByName(id)

      const {
        parent,
        level
      } = category

      const { selectedCategories } = this

      if (level === 1) {
        return !!selectedCategories.find(c => c === id)
      }

      if (level === 2) {
        return !!selectedCategories.find(c => c === id || c === parent)
      }
    },
    clickCategory(id) {
      // type - add, del
      const type = this.categoryChecked(id) ? 'del' : 'add'

      const category = this.getCategoryByName(id)

      const {
        parent,
        level
      } = category

      const { selectedCategories } = this

      if (level === 1) {
        const categories = selectedCategories
          .filter(c => {
            const i = this.getCategoryByName(c)

            return i.parent !== id && i.id !== id
          })

        if (type === 'add') {
          this.selectedCategories = [
            ...categories,
            id
          ]
        } else {
          this.selectedCategories = [...categories]
        }

        return
      }

      if (level === 2) {
        const categories = selectedCategories
          .filter(c => {
            const i = this.getCategoryByName(c)

            return i.id !== parent && i.id !== id
          })

        if (type === 'add') {
          this.selectedCategories = [...categories, id]
        } else {
          const p = selectedCategories.find(c => c === parent)

          if (p) {
            const mainCategories = this.getMainCategories(p)
              .filter(c => c.id !== id)
              .map(c => c.id)

            this.selectedCategories = [
              ...categories,
              ...mainCategories
            ]
          } else {
            this.selectedCategories = [...categories]
          }
        }
      }
    },
    empty() {
      // 一律由外部 prop 清空
      // this.selectedCategories = []
    },
    cancel() {
      this.empty()
      this.$emit('cancel')
    },
    ok() {
      this.$emit('ok', [...this.selectedCategories])
      this.empty()
    }
  },
  computed: {
    topCategories() {
      return this.allCategories
        .filter(c => c.level === 1)
        .map(c => ({
          categories: [...this.getMainCategories(c.id)],
          label: c.nameCn,
          parent: '',
          level: 1,
          id: c.id
        }))
    }
  },
  watch: {
    categories(v) {
      if (isequal(v, this.selectedCategories)) {
        return
      }

      this.selectedCategories = [...v]
    }
  },
  updated() {
    console.debug('category selector updated')
  }
}

</script>

<style scoped>

@import './selector'

</style>
