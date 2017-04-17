
<template>
  <div>
    <span>{{ label }}</span>
    <span>{{ value }}</span>
  </div>
</template>

<script>

export default {
  name: 'item',
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

  & > span:first-child {
    width: 80px;
    margin-right: 10px;
    font-size: 14px;
    color: #5e6d82;
    text-align: right;
  }

  & > span:last-child {
    font-size: 14px;
    color: #1f2d3d;
  }
}

</style>
