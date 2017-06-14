
<template>
  <div class="qwt-charge">
    <topbar :user-info="userInfo">
      <label slot="title">全网通 - 服务购买</label>
    </topbar>
    <section>
      <div>
        <header>
          请选择您需要的全网通版本：
        </header>
        <main>
          <qwt-pkg-widget name="基础版" :price="1588"
            h1="360天" h2="588元" />
          <qwt-pkg-widget name="超值版" :price="5088"
            h1="360天" h2="5088元" />
          <qwt-pkg-widget name="特惠版" :price="10188"
            h1="360天" h2="10188元" />
        </main>
      </div>
      <div>
        <header>
          推广资金充值金额：
        </header>
        <main>
          <qwt-pro-widget :price="288" />
          <qwt-pro-widget :price="588" />
          <qwt-pro-widget :price="1088" />
          <qwt-pro-widget :price="3088" />
          <qwt-pro-widget title="其他金额" />
          <qwt-pro-widget title="暂不充值" />
        </main>
      </div>
    </section>
    <section>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <footer>
        <li>推广资金使用规则：</li>
        <li>1. 该资金充值后不可退款。</li>
        <li>2. 该资金自充值之日起有效期为一年，请在有效期内使用。</li>
        <li>3. 该资金只用于购买站外推广，不能购买其他付费产品，不能转入余额，不能转入一卡通。</li>
        <li>4. 推广下线后如有剩余预算，将于下线第二日自动转入站外推广资金。</li>
        <li>5. 详细推广记录请在【账户】-【账户明细】-【消费记录】查看。</li>
      </footer>
    </section>
  </div>
</template>

<script>

import QwtPkgWidget from 'com/widget/qwt-pkg'
import QwtProWidget from 'com/widget/qwt-pro'
import Topbar from 'com/topbar'

export default {
  name: 'qwt-charge',
  components: {
    QwtPkgWidget,
    QwtProWidget,
    Topbar
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  }
}

</script>

<style scoped>

.qwt-charge {
  padding: 0 35px;
  width: 100%;

  & > section:nth-child(2) {
    & > div {
      & > header {
        font-size: 14px;
        color: #6a778c;
      }

      & > main {
        margin-top: 25px;
      }
    }
  }

  & > section:last-child {
    & > footer {
      font-size: 13px;
      line-height: 1.62;
      color: #6a778c;
    }
  }
}

</style>
