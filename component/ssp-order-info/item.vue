
<template>
  <div>
    <label>{{ label }}</label>
    <span>{{ value }}</span>
  </div>
</template>

<script>
export default {
  name: 'order-info-item',
  props: {
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

  & > label {
    width: 80px;
    margin-right: 10px;
    font-size: 14px;
    color: #5e6d82;
    text-align: right;
  }

  & > span {
    font-size: 14px;
    color: #1f2d3d;
  }
}
</style>
