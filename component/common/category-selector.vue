
<template>
  <el-dialog title="类目选择" v-model="visible"
    :close-on-click-modal="false" size="large"
    @close="cancel">
    <main class="main">
      <div v-for="c in topCategories">
        <span v-bind:class="{ selected: categoryChecked(c) }"
          @click="clickCategory(c)">
          {{ c.label }}
        </span>
        <span>
          <p v-for="category in c.categories"
            v-bind:class="{ selected: categoryChecked(category) }"
            @click="clickCategory(category)">
            {{ category.label }}
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

export default {
  name: 'category-selector',
  props: {
    allCategories: {
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
      selectedCategories: []
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
    categoryChecked(c) {
      const {
        parent,
        level,
        id
      } = c

      const { selectedCategories } = this

      if (level === 1) {
        return !!selectedCategories.find(c => c.id === id)
      }

      if (level === 2) {
        return !!selectedCategories.find(c => c.id === id || c.id === parent)
      }
    },
    clickCategory(c) {
      // type - add, del
      const type = this.categoryChecked(c) ? 'del' : 'add'

      const {
        parent,
        level,
        id
      } = c

      const { selectedCategories } = this

      if (level === 1) {
        const categories = selectedCategories
          .filter(c => c.parent !== id && c.id !== id)

        if (type === 'add') {
          this.selectedCategories = [
            ...categories,
            {...c}
          ]
        } else {
          this.selectedCategories = [...categories]
        }

        return
      }

      if (level === 2) {
        const categories = selectedCategories
          .filter(c => c.id !== parent && c.id !== id)

        if (type === 'add') {
          this.selectedCategories = [...categories, {...c}]
        } else {
          const p = selectedCategories.find(c => c.id === parent)

          if (p) {
            const mainCategories = this.getMainCategories(p.id).filter(c => c.id !== id)
            this.selectedCategories = [
              ...categories,
              ...mainCategories
            ]
          } else {
            this.selectedCategories = [...categories]
          }
        }

        return
      }
    },
    empty() {
      this.selectedCategories = []
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
  }
}

</script>

<style scoped>

@import './selector'

</style>
