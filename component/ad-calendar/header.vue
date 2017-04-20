
<template>
  <header class="ad-calendar-header">

  </header>
</template>

<script>

export default {
  name: 'ad-calendar-header'
}

</script>

<style scoped>

@import '../../cssbase/mixin';
@import 'cssbase/mixin';

.ad-calendar-header {
  @mixin top-filter;
  height: 160px;
}

</style>
