<template>
  <span>
    <a target="_blank" href="/qa?promotion-rules">行业投放规则</a>
  </span>
</template>

<script>
export default {
  name: 'bax-promotion-rule-link'
}
</script>

<style scoped>
@import '../../cssbase/mixin';
@import '../../cssbase/var';

span {
  @mixin center;
  margin-left: 5px;

  & > a {
    color: var(--c-main-blue);
    font-size: 14px;
  }
}
</style>
