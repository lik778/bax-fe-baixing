<template>
  <section>
    <img />
    <div class="rules">
      <p><span>1</span>活动时间：10月25日-11月20日</p>
      <p><span>1</span>优惠券可在电脑端全网通系统-首页中查看，30天内有效；优惠券不与本次活动同享</p>
      <p><span>3</span>购买前请阅读违禁行业类目；对于违禁行业，不能进行全网通推广，如购买后不支持退款；违禁行业类目见：<a href="http://bax.baixing.com.cn/qa?mode=questions"><strong>http://bax.baixing.com.cn/qa?mode=questions</strong></a></p>
      <p><span>4</span>本次活动精品官网和推广资金不支持退款，如有疑问请致电客服 <strong>400-036-3650</strong></p>
      <p><span>5</span>解释权归百姓网所有</p>
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
      background-color: #8616FF;
      color: white;
    }
    & > a > strong, & > strong {
      color: #FFD500;
    }
  }
}
</style>
