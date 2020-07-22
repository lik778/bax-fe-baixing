<template>
  <div class="bg bw-artificial">
    <div class="white-bg">
      <header>人工报价记录</header>
      <el-table class="record-table" :data="artificialHistory">
        <el-table-column label="查询日前" />
        <el-table-column label="关键词" />
        <el-table-column label="推广平台" />
        <el-table-column label="城市" />
        <el-table-column label="状态" />
        <el-table-column label="人工报价" />
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button type="primary">加入购物车</el-button><br />
            <el-button type="default">查价</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BwArtificial',
  data() {
    return {
      artificialHistory: null
    }
  }
}
</script>

<style lang="postcss" scoped>
.bw-artificial {
  &.bg {
    & > .white-bg {
      background-color: #fff;

      & > main {
        box-shadow: 0px 2px 9px 0px rgba(83, 95, 127, .1);
        min-height: 700px;
        padding: 45px 60px;
      }
    }
  }

  & header {
    color: #666;
    border-bottom: 1px solid #E6E6E6;
    padding: 15px;
    font-size: 16px;
  }

  & .record-table {
    margin-top: 40px;
  } 
}
</style>