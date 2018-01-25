<template>
  <div class="card">
    <header>
      <strong>推广状态通知</strong>
    </header>
    <content>
      敬请期待~
    </content>
  </div>
</template>

<script>
export default {
  name: 'qwt-homepage-notification'
}
</script>

<style scoped>
.card {
  display: flex;
  flex-flow: column;
  width: 402px;
  height: 128px;
  margin-top: 10px;

  & content {
    padding-top: 20px;
    font-size: 14px;
    color: #666666;
  }
}
</style>
