<template>
  <div class="box">
    <img class="icon" src="//file.baixing.net/202010/6fb5637fec8b9c8ea1cf97afae80a1e7.png">
    <div class="intro">
      <ul class="clearfix">
        <li>SEM千词包</li>
        <li>精品官网:180天</li>
        <li>SEO万词</li>
      </ul>
      <p>产品说明：1.一词一省一买  2.一词两省起卖  3.每新增一省价格</p>
    </div>
    <div class="price">
      <p>套餐价:<br/>6980元</p>
    </div>
  </div>
</template>

<script>
export default {
name: "product-intro"
}
</script>

<style lang="postcss" scoped>
  .box {
    position: relative;
    width: 585px;
    height: 160px;
    border-radius: 2px;
    border: 1px solid #FF7D51;
    margin-bottom: 60px;
    & .icon {
      position: absolute;
      left: -8px;
      top: -8px;
      height: 40px;
    }

    & .intro {
      float: left;
      padding: 20px;
      width: 448px;
      height: 100%;
      background: #fff7ea;
      border-right: 1px solid #FF7D51;
    }
    & .intro > ul {
      margin-top: 30px;
      padding-bottom: 20px;
      border-bottom: 1px dashed #FF7D51;
    }
    & .intro > ul li {
      position: relative;
      color: #FF7D51;
      float: left;
      margin-right: 25px;
      padding-left: 5px;
    }
    & .intro > ul li::before {
      position: absolute;
      left: -5px;
      top: 9px;
      display: inline-block;
      content: '';
      width: 4px;
      height: 4px;
      background: #FF7D51;
      border-radius: 100%;
    }

    & .intro > ul li:last-child {
      margin-right: 0;
    }

    & .intro > p {
      font-size: 12px;
      color: #FF7D51;
      padding-top: 20px;
    }

    & .price {
      float: right;
      width: 135px;
      font-size: 18px;
      color: #FF6E51;
      padding: 55px 35px;
    }
  }
  .clearfix:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
  }
</style>
