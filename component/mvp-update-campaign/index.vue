<template>
  <div class="mvp-update-campaign">
    <topbar :user-info="userInfo"></topbar>
    <main>
      <section class="content">
        <header>
          <i>1</i>
          <strong>设置推广内容：</strong>
        </header>
        <main>
          <div class="channel">
            <section>
              <li>
                <strong>推广渠道：</strong>
                <label>点击查看渠道效果</label>
              </li>
              <li>
                <el-button-group>
                  <el-button type="primary" size="small">百度</el-button>
                  <el-button size="small" disabled>360</el-button>
                  <el-button size="small" disabled>搜狗</el-button>
                  <el-button size="small" disabled>今日头条</el-button>
                </el-button-group>
                <i>媒体陆续开放中，敬请期待</i>
              </li>
            </section>
            <section>
              <li>
                <strong>投放终端：</strong>
              </li>
              <li>
                <el-button-group>
                  <el-button type="primary" size="small">移动端</el-button>
                  <el-button size="small" disabled>电脑端</el-button>
                </el-button-group>
                <i>电脑端敬请期待</i>
              </li>
            </section>
          </div>
          <div class="setting">
            <section>
              <li>
                <strong>投放页面：</strong>
                <label>点击查看页面效果</label>
              </li>
              <li>
                <el-button-group>
                  <el-button type="primary" size="small">帖子</el-button>
                  <el-button size="small" disabled>官网</el-button>
                  <el-button size="small" disabled>微站</el-button>
                </el-button-group>
                <i>其他页面陆续开放中，敬请期待</i>
              </li>
            </section>
            <section class="add-ad">
              <user-ad-selector type="reselect"
                :all-areas="allAreas"
                :selected-id="selectedAdId"
                @select-ad="ad => onSelectAd(ad)" />
            </section>
            <section class="add-area">
              <strong>投放城市：</strong>
              <span>
                <el-tag type="success"
                  v-for="c in getProp('areas')" :key="c">
                  {{ formatArea(c) }}
                </el-tag>
              </span>
            </section>
            <section>
              <strong>投放时长：</strong>
              <el-button-group>
                <el-button type="primary" size="small">长期投放</el-button>
                <el-button size="small" disabled>定期投放</el-button>
              </el-button-group>
              <i>定期投放敬请期待</i>
            </section>
          </div>
        </main>
      </section>
      <section class="price">
        <header>
          <i>2</i>
          <strong>设置推广价格：</strong>
        </header>
        <main>
          <div>
            <strong>最高点击单价：</strong>
            <el-input-number :value="getProp('cpcPrice')"
              style="width: 72px; margin-right: 9px;"
              size="small" :min="0" :controls="false"
              @change="v => campaign.cpcPrice = fmtPrice(v)">
            </el-input-number>
            <strong>元</strong>
            <p>{{ `最高点击单价不得低于：${minCpcPrice}元` }}</p>
            <i>出价越高，免费展示几率越大，位置越靠前！</i>
          </div>
          <div>
            <strong>单日总预算：</strong>
            <el-input-number :value="getProp('dailyBudget')"
              style="width: 72px; margin-right: 9px;"
              size="small" :step="1" :min="0" :controls="false"
              @change="v => campaign.dailyBudget = fmtPrice(v)">
            </el-input-number>
            <strong>元</strong>
            <p>{{ `您当前的总预算不得低于：${minBudget}元` }}</p>
            <i>总预算越高，免费展示时长越长，效果越好！</i>
          </div>
          <div>
            您的推广资金余额：<i>{{ balance }}</i>元，
            可消耗<i>{{ consumeDays }}</i>天
          </div>
        </main>
        <footer>
          <el-button type="primary" :disabled="isUpdating"
            @click="updateCampaign">
            更新推广
          </el-button>
        </footer>
      </section>
    </main>
    <area-selector type="mvp" :all-areas="allAreas"
      :areas="originCampaign.areas"
      :visible="areaDialogVisible"
      :enable-china="false"
      @ok="onChangeAreas"
      @cancel="areaDialogVisible = false">
    </area-selector>
  </div>
</template>

<script>
import UserAdSelector from 'com/common/user-ad-selector'
import AreaSelector from 'com/common/area-selector'
import BxIcon from 'com/widget/icon'
import Topbar from 'com/topbar'

import { getCnName } from 'util/meta'

import { updateCampaign } from 'api/fengming-mvp'

import { Message } from 'element-ui'

import store from './store'

export default {
  name: 'mvp-update-campaign',
  components: {
    UserAdSelector,
    AreaSelector,
    BxIcon,
    Topbar
  },
  fromMobx: {
    originCampaign: () => store.originCampaign,
    summary: () => store.summary
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    },
    allAreas: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      areaDialogVisible: false,
      isUpdating: false,
      campaign: {
        landingPageId: undefined,
        landingPage: undefined,
        category: undefined,
        areas: undefined,

        dailyBudget: undefined,
        cpcPrice: undefined
      }
    }
  },
  computed: {
    consumeDays() {
      const dailyBudget = this.getProp('dailyBudget')
      const { balance } = this.summary

      if (balance === 0) {
        return '0'
      }

      if (dailyBudget === 0) {
        return '?'
      }

      return (balance / 100 / dailyBudget) | 0
    },
    balance() {
      const { summary } = this
      return (summary.balance / 100).toFixed(2)
    },
    selectedAdId() {
      if (this.campaign.landingPageId) {
        return this.campaign.landingPageId
      }
      return this.originCampaign.landingPageId
    },
    minBudget() {
      const p = this.minCpcPrice
      const { cpcPrice } = this.campaign

      if (cpcPrice > p) {
        return parseFloat((cpcPrice * 30).toFixed(2))
      } else {
        return parseFloat((p * 30).toFixed(2))
      }
    },
    minCpcPrice() {
      return 1.5
    },
    id() {
      return this.$route.params.id
    }
  },
  methods: {
    async updateCampaign() {
      if (this.isUpdating) {
        return Message.warning('正在更新中, 请稍等一会儿 ~')
      }

      this.isUpdating = true

      try {
        await this._updateCampaign()
      } catch (err) {
        Message.error(err.message)
      } finally {
        this.isUpdating = false
      }
    },
    async _updateCampaign() {
      const { campaign, id } = this
      const data = {}

      if (typeof campaign.dailyBudget !== 'undefined') {
        if (campaign.dailyBudget < this.minBudget) {
          throw new Error(`每日预算不得低于 ${this.minBudget} 元`)
        }
        data.dailyBudget = campaign.dailyBudget * 100
      }
      if (typeof campaign.cpcPrice !== 'undefined') {
        if (campaign.cpcPrice < this.minCpcPrice) {
          throw new Error(`最高点击单价不得低于 ${this.minCpcPrice} 元`)
        }
        // 只要更新 cpcPrice price ~
        const v = this.getProp('dailyBudget')
        if (v < this.minBudget) {
          throw new Error(`每日预算不得低于 ${this.minBudget} 元`)
        }

        data.cpcPrice = campaign.cpcPrice * 100
      }

      ['category', 'areas', 'landingPageId', 'landingPage'].forEach(k => {
        if (typeof campaign[k] !== 'undefined') {
          data[k] = campaign[k]
        }
      })

      if (Object.keys(data).length) {
        await updateCampaign(id, data)
        await store.getCampaignInfo(id)
        Message.success('更新成功')
        this.$router.push({
          name: 'mvp-campaign-list'
        })
      } else {
        Message.warning('没有需要更新的变更')
      }
    },
    onSelectAd(ad) {
      this.campaign.category = ad.category
      this.campaign.areas = [ad.city]
      this.campaign.landingPageId = ad.adId
      this.campaign.landingPage = ad.url
    },
    onChangeAreas() {},
    formatArea(name) {
      const { allAreas } = this
      return getCnName(name, allAreas)
    },
    fmtPrice(v) {
      return parseFloat(((100 * v | 0) / 100).toFixed(2))
    },
    getProp(prop) {
      let v

      if (typeof this.campaign[prop] !== 'undefined') {
        v = this.campaign[prop]
      } else {
        v = this.originCampaign[prop]
        if (['dailyBudget', 'cpcPrice'].includes(prop)) {
          v = parseFloat((v / 100).toFixed(2))
        }
      }

      return v
    }
  },
  async mounted() {
    const { id } = this

    await Promise.all([
      store.getCampaignInfo(id),
      store.getSummary()
    ])
  }
}
</script>

<style scoped>
@import "../../cssbase/var";
@import "cssbase/mixin";

.mvp-update-campaign {
  width: 100%;

  & > main {
    width: 100%;
    padding: 10px 10px 30px 10px;
    background: var(--qwt-c-gray);
  }

  & .content, & .price {
    margin-top: 10px;
    background: white;
    padding: 20px;
    border-radius: 4px;

    & > header {
      display: flex;
      align-items: center;

      & > i {
        @mixin center;
        width: 22px;
        height: 22px;
        background: var(--qwt-c-blue);
        font-size: 12px;
        color: white;
        border-radius: 50%;
      }

      & > strong {
        margin-left: 10px;
        font-weight: 600;
        color: #666666;
      }
    }

    & > main {
      padding: 0 32px;

      & > div {
        & strong {
          font-weight: 500;
          line-height: 1.31;
          color: #666666;
        }

        & label {
          font-size: 12px;
          color: var(--qwt-c-blue);
        }

        & i {
          opacity: 0.89;
          font-size: 12px;
          color: #999999;
        }
      }
    }
  }

  & .content {
    & .channel, & .setting {
      & > section {
        margin-top: 22px;

        & > li {
          display: flex;
          align-items: center;
        }

        & > li:first-child {
          align-items: flex-end;
        }

        & > li:nth-child(2) {
          margin-top: 18px;

          & > i {
            margin-left: 10px;
          }
        }
      }
    }

    & .add-area {
      display: flex;
      max-width: 720px;

      & > strong {
        min-width: 80px;
      }

      & > span {
        & > i {
          cursor: pointer;
        }
      }

      & .el-tag {
        margin: 0 0 5px 5px;
      }
    }

    & .channel {
      padding-bottom: 27px;
      border-bottom: solid 1px #e5e5e5;
    }

    & .setting {
      padding-top: 4px;
    }
  }

  & .price {
    & > main {
      padding-bottom: 21px;
      border-bottom: solid 1px #e5e5e5;

      & > div {
        display: flex;
        align-items: center;
        margin-top: 26px;

        & > p {
          margin: 0 11px 0 9px;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.5;
          color: #fe3c3c;
        }
      }

      & > div:last-child {
        display: flex;
        align-items: center;
        font-size: 14px;
        line-height: 1.5;
        color: rgba(0, 0, 0, 0.75);

        & > i {
          margin: 0 5px;
          font-size: 22px;
          line-height: 1.05;
          color: #ff3c3c;
        }
      }
    }

    & > footer {
      padding-top: 23px;
    }
  }
}
</style>
