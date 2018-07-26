
<template>
  <footer>
    <li>移动端最高出价 = 电脑端CPC最高出价 * 移动端出价比例</li>
    <li>示例：若某关键词电脑端出价设为1.00元，移动出价比例为2，则该关键词在移动设备上的出价为2.00元</li>
  </footer>
</template>

<script>
export default {
  name: 'promotion-mobile-ratio-tip'
}
</script>

<style lang="postcss" scoped>

footer {
  margin: 10px 0;

  & > li {
    color: #717d91;
    font-size: 12px;
    line-height: 1.69;
  }
}

</style>
