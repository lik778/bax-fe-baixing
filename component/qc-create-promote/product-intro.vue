<template>
  <div class="box">
    <img
      class="icon"
      src="//file.baixing.net/202010/b21813d15ab60ddef31d5c61b96ad52e.png"
    />
    <div class="intro">
      <ul class="clearfix">
        <li>广告位投放包</li>
        <li>精品官网</li>
        <li>营销站群</li>
      </ul>
      <p>
        产品说明：1.广告位双端投放不低于1000个关键词；2.精品官网180天；3.用户独享的高权重站群域名180天
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'product-intro'
}
</script>

<style lang="scss" scoped>
.box {
  position: relative;
  width: 585px;
  height: 190px;
  border-radius: 2px;
  border: 1px solid #ff7d51;
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
    width: 100%;
    height: 100%;
    background: #fff7ea;
  }
  & .intro > ul {
    margin-top: 30px;
    padding-bottom: 20px;
    border-bottom: 1px dashed #ff7d51;
  }
  & .intro > ul li {
    position: relative;
    color: #ff7d51;
    float: left;
    margin-right: 25px;
    padding-left: 5px;
  }
  & .intro > ul li::before {
    position: absolute;
    left: -5px;
    top: 9px;
    display: inline-block;
    content: "";
    width: 4px;
    height: 4px;
    background: #ff7d51;
    border-radius: 100%;
  }

  & .intro > ul li:last-child {
    margin-right: 0;
  }

  & .intro > p {
    font-size: 12px;
    color: #ff7d51;
    padding-top: 20px;
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
