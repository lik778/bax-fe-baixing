<template>
  <div class="wrapper">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3>通知</h3>
      </div>
      <div class="card-body">
        <p>尊敬的用户，广告系统将于2018年01月22日15:00-2018年1月24日12:00期间升级维护，维护期间，计划将被暂停投放，请您在维护结束后继续投放。升级结束后会短信通知，请您留意。系统升级期间给您带来不便，请多包涵！</p>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 100px;
}
.box-card {
  width: 500px;
  height: 300px;
}
.card-body {
  margin-top: 50px;
}
</style>
