<template>
    <div class="product-wrapper">
        <h3 class="product-title">
            <span>{{product.name}}</span>
            <i class="hot-icon"></i>
        </h3>
    </div>
</template>
<script>
export default {
  name: 'product-item',
  props: {
    product: {
      type: Object,
      default: () => {},
      require: true
    }
  }
}
</script>
<style lang="scss" scoped>
.product-wrapper{
    width: 20%;
}
.product-title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .hot-icon{
        width: 13px;
        height: 15px;
        background: url('../../../../asset/hot-icon.png') no-repeat center/contain;
    }
}
</style>
