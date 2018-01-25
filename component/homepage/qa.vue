<template>
  <div class="card">
    <header>
      <strong>答疑解惑</strong>
    </header>
    <content>
      <section>
        <strong>【操作指南】</strong>
        <a target="_blank" href="/qa">如何使用站外推广</a>
      </section>
      <section>
        <strong>【常见问题】</strong>
        <a target="_blank" href="/qa">常见问题查询</a>
      </section>
    </content>
  </div>
</template>

<script>
export default {
  name: 'qwt-homepage-qa'
}
</script>

<style scoped>
.card {
  display: flex;
  flex-flow: column;
  width: 402px;
  height: 150px;
  margin-top: 10px;

  & content {
    padding-top: 20px;
    font-size: 14px;
    color: #666666;

    & > section:not(:first-child) {
      margin-top: 13px;
    }

    & strong {
      font-weight: 600;
    }

    & a {
      color: #666666;
      border-bottom: 1px solid #666666;
    }
  }
}
</style>
