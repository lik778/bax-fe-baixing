<template>
  <div class="bg">
    <div class="white-bg">
      <main></main>
    </div>
  </div>
</template>

<script>
export default {
  name: "qc-promote-list"
}
</script>

<style lang="postcss" scoped>
div.bg {
    &  > .white-bg {
    background-color: #fff;

    &  > main {
      box-shadow: 0px 2px 9px 0px rgba(83, 95, 127, .1);
      min-height: 700px;
      padding: 45px 60px;
    }
  }
}
</style>
