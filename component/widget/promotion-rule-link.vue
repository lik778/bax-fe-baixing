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

<style lang="scss" scoped>
span {
  @include center;
  margin-left: 5px;

  & > a {
    color: $c-main-blue;
    font-size: 14px;
  }
}
</style>
