
<template>
  <footer>
    <li>请注意：</li>
    <li>1. 预算不足时将有下线提醒（预算余额不足50元且当天23：59前未续费则下线）。如有剩余预算，将自动转入站外推广资金。</li>
    <li>2. 该资金无法用于购买其他付费产品，自产生当日起有效期为一年，超出有效期后，未用完部分将无法继续使用。</li>
    <a>常见问题解答</a>
  </footer>
</template>

<script>
export default {
  name: 'widget-promotion-charge-tip'
}
</script>

<style>
footer {
  color: #717d91;
  font-size: 13px;
  line-height: 1.69;

  & > a {
    color: #0994ff;
    cursor: pointer;
  }
}
</style>
