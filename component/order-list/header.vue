
<template>
  <section class="order-header">
    <div>
      <span></span>
      <span>
        <el-button type="primary">
          <router-link tag="p" :to="{ name: 'create-order' }">
            新建订单
          </router-link>
        </el-button>
      </span>
    </div>
    <div>
      <span class="filter-item">
        <label>订单状态</label>
        <el-input placeholder="..."></el-input>
      </span>
      <span class="filter-item">
        <label>客户</label>
        <el-input placeholder="请选择客户"></el-input>
      </span>
    </div>
    <div>
      <span class="filter-item">
        <label>创建时间</label>
        <el-date-picker type="date" placeholder="选择日期">
        </el-date-picker>
      </span>
      <span class="filter-item">
        <label>投放时间</label>
        <el-date-picker type="date" placeholder="选择日期">
        </el-date-picker>
      </span>
    </div>
  </section>
</template>

<script>

export default {
  name: 'order-header'
}

</script>

<style scoped>

@import '../../cssbase/mixin';
@import 'cssbase/mixin';

@mixin filter-item;

.order-header {
  @mixin top-filter;

  height: 160px;
  width: 800px;
  padding-top: 10px;

  & > div {
    display: flex;
    align-items: center;

    & > span:last-child {
      margin-left: 70px;
    }
  }
}

</style>
