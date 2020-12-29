
<template>
  <footer class="bax-pagination">
    <el-pagination small layout="prev, pager, next"
      :total="total" :page-size="limit"
      :current-page="current"
      @current-change="handleCurrentChange">
    </el-pagination>
  </footer>
</template>

<script>
export default {
  name: 'bax-pagination',
  props: {
    options: {
      type: Object,
      required: true
    }
  },
  computed: {
    offset: function () {
      return this.options.offset
    },
    total: function () {
      return this.options.total
    },
    limit: function () {
      return this.options.limit
    },
    current () {
      const { offset, limit } = this
      return Math.floor(offset / limit) + 1
    }
  },
  methods: {
    handleCurrentChange (page) {
      const offset = this.limit * (page - 1)
      this.$emit('current-change', { offset, page })
    }
  }
}
</script>

<style lang="scss" scoped>
.bax-pagination {
  @include center;
  padding: 10px 0 40px;
}
</style>
