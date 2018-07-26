<template>
  <div>
    <section-header>我的账户</section-header>
    <el-row type="flex" justify="space-around" align="center">
      <el-col :span="4"></el-col>
      <el-col :span="4" class="column">
        <h3>推广资金余额</h3>
        <p><strong>{{summary.balance / 100}}</strong>元</p>
        <router-link :to="{name: 'qwt-charge', query: {mode: 'charge-only'}}"
          @click.native="onClickCharge">
          <el-button type="primary">充值</el-button>
        </router-link>
      </el-col>
      <el-col :span="4" class="column">
        <h3>可用优惠券</h3>
        <p><span class="number">{{coupons.length}}</span>张</p>
        <router-link :to="{name: 'coupon'}"
          @click.native="onClickCoupon">
          <el-button type="primary">查看</el-button>
        </router-link>
      </el-col>
      <el-col :span="16" class="column">
        <el-row class="multi">
          <el-col :span="12">
            <div class="btn">
              <span>广告投放：</span>
              <router-link :to="{name: 'qwt-promotion-list'}"
                @click.native="onClickCampaignList">
                <el-button type="primary">推广管理</el-button>
              </router-link>
            </div>
            <div class="btn">
              <span>智能投放：</span>
              <router-link :to="{name: 'mvp-campaign-list'}"
                @click.native="onClickMvpCampaignList">
                <el-button type="primary">推广管理</el-button>
              </router-link>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import SectionHeader from 'com/common/section-header'
  import store from './store'

  import track from 'util/track'

  export default {
    name: 'account-summary',
    fromMobx: {
      summary: () => store.summary,
      coupons: () => store.coupons
    },
    components: {
      SectionHeader
    },
    methods: {
      onClickCreateCampaign() {
        track({
          action: 'account: click create campaign'
        })
      },
      onClickMvpCampaignList() {
        track({
          action: 'account: click query mvp campaigns'
        })
      },
      onClickCampaignList() {
        track({
          action: 'account: click query campaigns'
        })
      },
      onClickCoupon() {
        track({
          action: 'account: click coupon'
        })
      },
      onClickCharge() {
        track({
          action: 'account: click charge'
        })
      }
    },
    async mounted() {
      await Promise.all([
        store.getSummary(),
        store.getCoupons({ onlyValid: true, status: 0 })
      ])
    }
  }
</script>

<style lang="postcss" scoped>
  .column {
    display: flex;
    flex-flow: column;
    align-items: center;
  }
  p {
    margin: 10px 0;
  }
  .multi {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  .btn {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    & > span {
      font-weight: 600;
      color: #6a778c;
    }
  }
</style>
