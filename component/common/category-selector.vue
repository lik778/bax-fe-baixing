
<template>
  <el-dialog title="类目选择" :visible="visible"
    :close-on-click-modal="false"
    :before-close="ok">
    <main class="main">
      <div>
        <span @click="clickCategory('all-categories')">
          全部类目
        </span>
        <span></span>
      </div>
      <div v-for="(c, i) in topCategories" :key="i">
        <span v-bind:class="{ selected: categoryChecked(c.id) }"
          @click="clickCategory(c.id)">
          {{ c.label }}
        </span>
        <span>
          <p v-for="(category, i) in c.categories" :key="i"
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
  methods: {
    removeCategoryFromTopCategory(topId, mainId) {
      const top = this.topCategories.find(t => t.id === topId)

      return top.categories.filter(c => c.id !== mainId).map(c => c.id)
    },
    belongToTopCategory(category, topId) {
      const top = this.topCategories.find(t => t.id === topId)

      return top.categories.map(c => c.id).includes(category)
    },
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

      if (selectedCategories.includes('all-categories')) {
        return true
      }

      if (level === 1) {
        return !!selectedCategories.find(c => c === id)
      }

      if (level === 2) {
        return !!selectedCategories.find(c => c === id || c === parent)
      }
    },
    clickTopCategory(id) {
      const type = this.categoryChecked(id) ? 'del' : 'add'
      const { selectedCategories } = this

      if (type === 'add') {
        this.selectedCategories = [
          ...selectedCategories.filter(c => !this.belongToTopCategory(c, id)),
          id
        ]
      } else {
        // del
        if (selectedCategories.includes('all-categories')) {
          this.selectedCategories = [
            ...this.topCategories.filter(c => c.id !== id).map(c => c.id)
          ]
        } else {
          const categories = selectedCategories
            .filter(c => {
              const i = this.getCategoryByName(c)
              return i.parent !== id && i.id !== id
            })

          this.selectedCategories = [...categories]
        }
      }
    },
    clickMainCategory(id) {
      const type = this.categoryChecked(id) ? 'del' : 'add'
      const category = this.getCategoryByName(id)
      const { selectedCategories } = this
      const { parent } = category

      if (type === 'add') {
        this.selectedCategories = [
          ...selectedCategories,
          id
        ]
      } else {
        // del
        if (selectedCategories.includes('all-categories')) {
          this.selectedCategories = [
            ...this.topCategories.filter(t => t.id !== parent).map(t => t.id),
            ...this.removeCategoryFromTopCategory(parent, id)
          ]
        } else {
          const p = selectedCategories.find(c => c === parent)
          const categories = selectedCategories
            .filter(c => {
              const i = this.getCategoryByName(c)

              return i.id !== parent && i.id !== id
            })

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
    clickCategory(id) {
      const { selectedCategories } = this

      if (id === 'all-categories') {
        if (selectedCategories.includes('all-categories')) {
          this.selectedCategories = []
        } else {
          this.selectedCategories = ['all-categories']
        }
        return
      }

      const category = this.getCategoryByName(id)
      const { level } = category

      if (level === 1) {
        return this.clickTopCategory(id)
      }

      if (level === 2) {
        this.clickMainCategory(id)
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

<style lang="scss" scoped>
@import "./selector";
</style>
