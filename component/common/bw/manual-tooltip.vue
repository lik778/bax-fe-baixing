<template>
  <div>
    <h6>提示：</h6>
    <ol>
      <li>1、<span class="str-color">B2B行业可以选择【申请长单】</span>，非此行业提交后不返回长年单报价；</li>
      <li>2、人工报价时间：工作日09:00~17:00，查价返回预计等待3-5小时；</li>
      <li>3、每个客户，同一关键词，每天最多查询三次词，请勿重复提交；</li>
      <li>4、人工报价建议查询：单城市，省，全国维度；不建议跨省选择单/多城市报价（报价返回时效较长）</li>
    </ol>
  </div>
</template>

<script>
export default {
  name: 'ManualTooltip'
}
</script>

<style lang="scss" scoped>
.str-color {
  color: #ff6350;
}
</style>
