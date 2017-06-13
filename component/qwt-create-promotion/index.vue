
<template>
  <div class="qwt-create-promotion">
    <topbar :user-info="userInfo">
      <label slot="title">全网通 - 新建推广</label>
    </topbar>
    <main>
      <section>
        <header>推广目标设置</header>
        <div>
          <aside>选择渠道：</aside>
          <span>
            <el-checkbox-group>
              <el-checkbox label="百度" />
              <el-checkbox label="搜狗" />
            </el-checkbox-group>
          </span>
        </div>
        <div>
          <aside>投放页面：</aside>
          <span>
            <el-checkbox-group>
              <el-checkbox label="帖子详情页" />
              <el-checkbox label="企业官网" />
            </el-checkbox-group>
          </span>
        </div>
        <div>
          <aside>投放城市：</aside>
          <span></span>
        </div>
      </section>
      <section>
        <header>推广物料设置</header>
        <div>
          <aside>推广标题:</aside>
           <span>
            <el-input type="text" placeholder="请输入标题 ~"
              style="width: 420px" />
          </span>
        </div>
        <div>
          <aside>推广内容:</aside>
          <span>
            <el-input type="textarea" placeholder="请输入内容 ~"
              :rows="5" style="width: 420px" />
          </span>
        </div>
        <footer>
          <el-button type="primary">
            检查推广是否可用
          </el-button>
        </footer>
      </section>
      <section>
        <header>选取推广关键词</header>
      </section>
      <section>
        <header>设置时长和预算</header>
        <footer>
          <li>请注意：</li>
          <li>1. 预算不足时将有下线提醒（预算余额不足50元且当天23：59前未续费则下线）。如有剩余预算，将自动转入站外推广资金。</li>
          <li>2. 该资金无法用于购买其他付费产品，自产生当日起有效期为一年，超出有效期后，未用完部分将无法继续使用。</li>
        </footer>
      </section>
    </main>
  </div>
</template>

<script>

import Topbar from 'com/topbar'

export default {
  name: 'qwt-create-promotion',
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  components: {
    Topbar
  }
}

</script>

<style scoped>

.qwt-create-promotion {
  padding: 0 35px;
  width: 100%;

  & > main {
    & > section {
      margin-bottom: 20px;
      padding-bottom: 30px;
      border-bottom: 1px solid #c0ccda;

      & > header {
        color: #6a778c;
      }

      & > div {
        display: flex;
        margin: 15px 0;

        & > aside:first-child {
          margin-right: 20px;
          color: #6a778c;
          font-size: 14px;
        }

        .el-input {
          width: 420px;
        }
      }
    }

    & > section:last-child {
      & > footer {
        color: #717d91;
        font-size: 13px;
      }
    }
  }
}

</style>
