<template>
  <section>
    <img src="http://file.baixing.net/201811/6834bec9a2d41fc68c5b92532873535f.png" />
    <div class="rules">
      <p><span>1</span>活动时间：12月5日-12月31日</p>
      <p><span>2</span>优惠券不与本次活动同享</p>
      <p><span>3</span>购买前请阅读违禁行业类目；对于违禁行业，不能进行搜索通推广，如购买后不支持退款；违禁行业类目见：<a href="http://bax.baixing.com.cn/qa?mode=questions"><strong>http://bax.baixing.com.cn/qa?mode=questions</strong></a></p>
      <p><span>5</span>解释权归百姓网所有，如有疑问请致电客服 <strong>400-036-3650</strong></p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'rules'
}
</script>

<style scoped lang="postcss">
section {
  padding: 27px 13px 27px 35px;
  border-radius: 8px;
  color: #fff;
  background-color: #380098;
  margin-bottom: 20px;
  font-weight: lighter;
}
img {
  display: block;
  margin: auto;
}
.rules {
  & > p {
    margin-bottom: 10px;
    & > span {
      display: inline-block;
      width: 20px;
      height: 20px;
      text-align: center;
      margin-right: 10px;
      border-radius: 50%;
      background-color: #C7007B;
      color: white;
    }
    & > a > strong, & > strong {
      color: #FFD500;
    }
  }
}
</style>
