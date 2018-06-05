
<template>
  <div>
    <span>{{ label }}</span>
    <a v-if="tag === 'a'"
      target="_blank"
      :href="value">
      {{ value }}
    </a>
    <span v-else>
      {{ value }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'material-info-item',
  props: {
    tag: String,
    label: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number]
    }
  }
}
</script>

<style scoped>
div {
  display: flex;
  align-items: center;
  margin: 10px 0;

  & > span:first-child {
    width: 80px;
    margin-right: 10px;
    font-size: 14px;
    color: #5e6d82;
    text-align: right;
  }

  & > span:last-child,
  & > a:last-child {
    font-size: 14px;
    color: #1f2d3d;
  }
}
</style>
