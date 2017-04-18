
<template>
  <section class="order-header">
    <div>
      <span></span>
      <span>
        <el-button type="primary">
          <router-link tag="p" to="/order/create">
            新建订单
          </router-link>
        </el-button>
      </span>
    </div>
    <div>
      <span>
        <label>订单状态</label>
        <el-input placeholder="..."></el-input>
      </span>
      <span>
        <label>客户</label>
        <el-input placeholder="请选择客户"></el-input>
      </span>
    </div>
    <div>
      <span>
        <label>创建时间</label>
        <el-date-picker type="date" placeholder="选择日期">
        </el-date-picker>
      </span>
      <span>
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

.order-header {
  @mixin top-filter;
  height: 160px;
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
