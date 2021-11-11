<template>
    <div class="product-wrapper">
        <h3 class="product-title">
            <span>{{product.name}}</span>
            <i class="hot-icon"></i>
        </h3>
        <ul>
            <li>360天</li>
            <li>双端</li>
            <li>7天*24小时</li>
        </ul>
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
    border: 1px solid #FA6A78;
    border-radius: 8px;
    overflow: hidden;
    box-sizing: border-box;
}
.product-title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-image: linear-gradient(180deg, #FFAD94 0%, #F95771 100%);
    padding: 7px 10px;
    font-family: PingFangSC-Medium;
    font-size: 13px;
    color: #FFFFFF;
    .hot-icon{
        width: 13px;
        height: 15px;
        background: url('../../../../asset/hot-icon.png') no-repeat center/contain;
    }
}
</style>
