<template>
    <div class="title">
        <h4>{{title}}</h4>
        <span v-if="extra" class="extra-title">({{extra}})</span>
    </div>
</template>

<script>
export default {
  name: 'Title',
  props: {
    title: {
      type: String,
      default: '',
      require: false
    },
    extra: {
      type: String,
      default: '',
      require: false
    }
  }
}
</script>

<style lang="scss" scoped>
    .title{
        padding: 8px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 10px;
        .extra-title{
            font-size: 12px;
            color: #999999;
            margin-left: 6px;
        }
    }
</style>
