
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
      <section class="keyword">
        <header>选取推广关键词</header>
        <h4>根据当月数据，为您推荐如下关键词</h4>
        <keyword-list />
        <h3>
          <label>若没有您满意的关键词，</label>
          <a>点此自定义添加</a>
        </h3>
        <div>
          <span>
            <el-input placeholder="请输入关键词" />
          </span>
          <el-button type="primary">
            查询
          </el-button>
          <strong>
            （请优先添加较为核心的关键词，关键词长度不宜超过5个字，不区分大小写。）
          </strong>
        </div>
        <keyword-list />
      </section>
      <section class="timing">
        <header>设置时长和预算</header>
        <div>
          <aside>投放时间:</aside>
          <span>
            <el-date-picker type="daterange" placeholder="选择日期范围" />
          </span>
          <span>
            <el-checkbox label="长期投放" />
          </span>
        </div>
        <div>
          <aside>设置推广日预算:</aside>
          <span>
            <el-input placeholder="请输入每日最高预算" />
          </span>
          <i>元</i>
          <span>
            （根据您选取的关键词，最低预算为<p>XXX</p>元）
          </span>
        </div>
        <h3>
          需支付<strong>￥8888.00</strong>元，您的推广资金余额：<i>6666</i>元。
        </h3>
        <h4>
          <el-checkbox />
          <label>我已阅读并同意遵守</label>
          <a>《百姓网站外推广用户协议》</a>
        </h4>
        <div>
          <el-button type="primary">
            先去充值
          </el-button>
        </div>
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

import KeywordList from './keyword-list'
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
    KeywordList,
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

    & > section.keyword {
      & > h4 {
        margin: 20px 0 30px;
        color: #6a778c;
        font-size: 13px;
        font-weight: normal;
      }

      & > h3 {
        font-size: 14px;
        font-weight: normal;

        & > label {
          color: #424344;
        }

        & > a {
          color: #0994ff;
          cursor: pointer;
        }
      }

      & > div:nth-child(5) {
        display: flex;
        align-items: center;

        & > span {
          margin-right: 20px;
        }

        & > strong {
          color: #404e61;
          font-size: 13px;
          font-weight: normal;
        }
      }
    }

    & > section.timing {
      & > div {
        display: flex;
        align-items: center;
      }

      & > div:nth-child(2) {
        & > span:last-child {
          margin-left: 20px;
        }
      }

      & > div:nth-child(3) {
        & > span:nth-child(2) {
          width: 220px;
        }

        & > i {
          margin-left: 5px;
          color: #6a778c;
          font-size: 13px;
        }

        & > span:last-child {
          display: flex;
          align-center: center;
          margin: 0 3px;
          width: 260px;
          font-size: 13px;
          color: #404e61;

          & > p {
            color: red;
          }
        }
      }

      & > h3 {
        color: #6a778c;
        font-size: 14px;
        font-weight: normal;

        & > strong {
          margin: 0 5px;
          color: #ff3001;
          font-size: 18px;
        }
      }

      & > h4 {
        margin-top: 30px;
        font-size: 14px;
        font-weight: normal;

        & > label {
          color: #6a778c;
        }

        & > a {
          color: #0994ff;
          cursor: pointer;
        }
      }

      & > footer {
        color: #717d91;
        font-size: 13px;
      }
    }
  }
}

</style>
