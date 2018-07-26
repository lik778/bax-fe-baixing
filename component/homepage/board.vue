<template>
  <div class="card">
    <header>
      <strong>公告板</strong>
    </header>
    <content>
      敬请期待~
    </content>
  </div>
</template>

<script>
export default {
  name: 'qwt-homepage-board'
}
</script>

<style lang="postcss" scoped>
.card {
  display: flex;
  flex-flow: column;
  width: 402px;
  height: 128px;

  & content {
    padding-top: 20px;
    font-size: 14px;
    color: #666666;
  }
}
</style>
