<template>
  <div class="card">
    <header>
      <strong>账户概览</strong>
      <router-link :to="{name: 'account'}"
        @click.native="onClickAccountDetail">
        查看详情
      </router-link>
    </header>
    <content>
      <span class="money">
        <h3>推广可用资金</h3>
        <p>
          <strong>
            {{ balance }}
          </strong>
          <span>元</span>
        </p>
        <router-link :class="{button: true, primary: balance === 0}"
          :to="{name: 'qwt-charge', query: {mode: 'charge-only'}}"
          @click.native="onClickCharge">
          立即充值
        </router-link>
      </span>
      <span class="coupon">
        <h3>可用优惠券</h3>
        <p>
          <strong>
            {{ coupons.length }}
          </strong>
          <span>张</span>
        </p>
        <router-link class="button" :to="{name: 'coupon'}"
          @click.native="onClickCoupon">
          查看
        </router-link>
      </span>
    </content>
  </div>
</template>

<script>
import track from 'util/track'

export default {
  name: 'qwt-homepage-account',
  props: {
    userInfo: {
      type: Object,
      required: true
    },
    summary: {
      type: Object,
      required: true
    },
    coupons: {
      type: Array,
      required: true
    }
  },
  computed: {
    balance() {
      const { summary } = this
      return (summary.balance / 100).toFixed(2)
    }
  },
  methods: {
    onClickCreateCampaign() {
      const { userInfo } = this
      track({
        action: 'homepage account: click create campaign',
        baixingId: userInfo.baixingId,
        baxId: userInfo.id
      })
    },
    onClickQueryCampaigns() {
      const { userInfo } = this
      track({
        action: 'homepage account: click view campaigns',
        baixingId: userInfo.baixingId,
        baxId: userInfo.id
      })
    },
    onClickAccountDetail() {
      const { userInfo } = this
      track({
        action: 'homepage account: click account detail',
        baixingId: userInfo.baixingId,
        baxId: userInfo.id
      })
    },
    onClickCharge() {
      const { userInfo } = this
      track({
        action: 'homepage account: click charge',
        baixingId: userInfo.baixingId,
        baxId: userInfo.id
      })
    },
    onClickCoupon() {
      const { userInfo } = this
      track({
        action: 'homepage account: click coupon',
        baixingId: userInfo.baixingId,
        baxId: userInfo.id
      })
    }
  }
}
</script>

<style scoped>
@import '../../cssbase/mixin';
@import '../../cssbase/var';

.card {
  display: flex;
  flex-flow: column;
  width: 694px;
  height: 224px;

  & > content {
    display: flex;
    margin-top: 26px;
  }
}

.money, .coupon {
  display: inline-flex;
  flex-flow: column;
  align-items: center;
  flex-grow: 0.5;
  padding-top: 10px;

  & > h3 {
    font-size: 14px;
    color: #666666;
    font-weight: 600;
  }

  & > p {
    display: flex;
    align-items: center;
    margin: 10px 0 20px;

    & > strong {
      font-size: 24px;
      font-weight: 600;
      color: var(--qwt-c-blue);
    }

    & > span {
      @mixin center;
      margin-left: 10px;
      font-weight: 600;
      color: #647781;
    }
  }
}

.money {
  border-right: 1px solid #e6e6e6;
}

.button {
  @mixin center;
  width: 110px;
  height: 32px;
  font-size: 14px;
  border-radius: 4px;
  color: #666666;
  border: 1px solid #d9d9d9;
}

.button.primary {
  border: unset;
  color: white;
  background: var(--qwt-c-blue);
}
</style>
