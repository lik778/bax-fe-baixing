<template>
    <el-dialog
      width="578px"
      :visible.sync="showNotice"
      :close-on-click-modal="false"
      :show-close="false">
      <h3 slot="title">通知</h3>
      <div class="notification">
        <p>亲爱的用户，为了提供更稳定的系统服务，我们将在如下时间进行系统维护，在此期间可能对您的操作发生影响,感谢您的谅解。</p>
        <ul>
          <li>
            影响时间
            <p>2020-10-13 22:00 – 2020-10-14 04:00</p>
          </li>
        </ul>
      </div>
    </el-dialog>
</template>

<script>


export default {
  name: 'notification',
  data() {
    return {
      showNotice: false
    }
  }
}
</script>

<style scoped lang="scss">
.notification {
  font-size: 15px;

  & > ul {
    padding: 20px;
  }

  & li {
    list-style: disc;
    margin-bottom: 10px;

    & p {
      line-height: 1.6;
      font-size: 14px;
      text-indent: 1.5em;
    }
  }
}
</style>
