
<template>
  <section>
    <div>
      <span>
        <label>类型</label>
        <el-input placeholder="请选择类型"></el-input>
      </span>
      <span>
        <label>规格</label>
        <el-input placeholder="请选择规格"></el-input>
      </span>
    </div>
    <div>
      <span>
        <label>创建时间</label>
        <el-date-picker type="date" placeholder="选择日期">
        </el-date-picker>
      </span>
      <span>
        <label>客户</label>
        <el-input placeholder="请选择客户"></el-input>
      </span>
    </div>
  </section>
</template>

<script>

export default {
  name: 'material-filter'
}

</script>

<style scoped>

@import 'cssbase/mixin';

section {
  border: 1px solid #a3b2c4;
  height: 110px;
  width: 800px;

  & > div {
    display: flex;
    align-items: center;

    & > span:last-child {
      margin-left: 70px;
    }

    & > span {
      display: flex;
      align-items: center;
      margin-top: 16px;
      width: 250px;
      height: 30px;
      padding: 0 18px;

      & > label {
        @mixin center;
        min-width: 50px;
        width: 50px;
        margin: 0 5px;
        font-size: 12px;
        color: #475669;
      }
    }
  }
}

</style>
