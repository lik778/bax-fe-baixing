<template>
  <div class="card">
    <header>
      <strong>账户概览</strong>
      <router-link :to="{name: 'account'}">
        查看详情
      </router-link>
    </header>
    <content>
      <span class="money">
        <h3>推广可用资金</h3>
        <p>
          <strong>
            {{ summary.balance / 100 }}
          </strong>
          <span>元</span>
        </p>
        <router-link class="button primary"
          :to="{name: 'qwt-charge', query: {mode: 'charge-only'}}">
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
        <router-link class="button"
          :to="{name: 'coupon'}">
          查看
        </router-link>
      </span>
      <span class="campaign">
        <h3>我的推广</h3>
        <p>
          <strong>
            {{ summary.campaignCount }}
          </strong>
          <span>个</span>
        </p>
        <div>
          <router-link class="button"
            :to="{name: 'qwt-create-promotion'}">
            新建推广计划
          </router-link>
          <router-link class="button"
            :to="{name: 'qwt-promotion-list'}">
            管理推广计划
          </router-link>
        </div>
      </span>
    </content>
  </div>
</template>

<script>
export default {
  name: 'qwt-homepage-account',
  props: {
    summary: {
      type: Object,
      required: true
    },
    coupons: {
      type: Array,
      required: true
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
    margin-top: 26px;
  }
}

.money, .coupon, .campaign {
  display: inline-flex;
  flex-flow: column;
  align-items: center;
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
  width: 170px;
  border-right: 1px solid #e6e6e6;
}

.coupon {
  width: 190px;
  border-right: 1px solid #e6e6e6;
}

.campaign {
  flex-grow: 1;

  & > div:last-child {
    display: flex;
  }

  & .button:first-child {
    margin-left: 20px;
  }

  & .button:last-child {
    margin-left: 20px;
  }
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
