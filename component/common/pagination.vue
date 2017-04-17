
<template>
  <footer class="bax-pagination">
    <el-pagination small layout="prev, pager, next"
      :total="total" :page-size="limit"
      :current-page="current"
      @current-change="handleCurrentChange" />
  </footer>
</template>

<script>

export default {
  name: 'bax-pagination',
  props: {
    offset: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    limit: {
      type: Number,
      required: true
    }
  },
  computed: {
    current() {
      const { offset, limit } = this
      return Math.floor(offset / limit) + 1
    }
  },
  methods: {
    handleCurrentChange(page) {
      const offset = this.limit * (page - 1)
      this.$emit('current-change', {offset, page})
    }
  }
}

</script>

<style scoped>

@import 'cssbase/mixin';

.bax-pagination {
  @mixin center;
}

</style>
