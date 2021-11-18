<template>
    <p class="description-item">
      <label>{{label}}</label>
      <span>{{value}}</span>
    </p>
</template>
<script>
export default {
  name: 'bw-description-item',
  props: {
    label: {
      type: String,
      default: '',
      require: true
    },
    value: {
      type: [String, Number],
      default: 0,
      require: true
    }
  }
}
</script>
<style lang="scss" scoped>
  .description-item{
    display: flex;
    align-items: center;
    &:not(:last-child){
      margin-right: 20px;
    }
    label{
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #666666;
    }
    span{
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #333333;
    }
  }
</style>
