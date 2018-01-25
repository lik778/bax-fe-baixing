<template>
  <div class="card">
    <header>
      <strong>推广情况</strong>
      <router-link :to="{name: 'qwt-promotion-list'}">
        查看详情
      </router-link>
    </header>
    <content>
      <span>
        <h3>???</h3>
        <p>点击量</p>
      </span>
      <span>
        <h3>???</h3>
        <p>消耗</p>
      </span>
      <span>
        <h3>???</h3>
        <p>展示量</p>
      </span>
    </content>
    <footer>
      <i></i>
      <span>
        以上均为昨日数据，了解详细数据请点击查看详情
      </span>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'qwt-homepage-campaign'
}
</script>

<style scoped>
.card {
  width: 694px;
  height: 220px;
  margin-top: 10px;

  & > content {
    display: flex;
    margin-top: 21px;

    & > span {
      display: flex;
      flex-flow: column;
      align-items: center;
      flex-grow: 0.33;
      padding: 10px 0 12px;
      font-weight: 600;
      color: #666666;

      &:not(:last-child) {
        border-right: solid 1px #e6e6e6;
      }

      & > h3 {
        font-size: 24px;
      }

      & > p {
        margin-top: 10px;
        font-size: 14px;
      }
    }

  }

  & > footer {
    margin-top: 20px;
    font-size: 14px;
    color: #999999;
  }
}
</style>
