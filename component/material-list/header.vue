
<template>
  <section class="material-header">
    <div>
      <span class="filter-item">
        <label>类型</label>
        <el-input placeholder="请选择类型"></el-input>
      </span>
      <span class="filter-item">
        <label>规格</label>
        <el-input placeholder="请选择规格"></el-input>
      </span>
    </div>
    <div>
      <span class="filter-item">
        <label>创建时间</label>
        <el-date-picker type="date" placeholder="选择日期">
        </el-date-picker>
      </span>
      <span class="filter-item">
        <label>客户</label>
        <el-input placeholder="请选择客户"></el-input>
      </span>
    </div>
  </section>
</template>

<script>

export default {
  name: 'material-header'
}

</script>

<style scoped>

@import '../../cssbase/mixin';
@import 'cssbase/mixin';

@mixin filter-item;

.material-header {
  @mixin top-filter;
  height: 110px;
  width: 800px;

  & > div {
    display: flex;
    align-items: center;

    & > span:last-child {
      margin-left: 70px;
    }
  }
}

</style>
