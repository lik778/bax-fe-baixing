<template>
  <div class="qwt-create-promotion">

    <topbar :user-info="userInfo">
      <label slot="title">全网通 - 新建推广</label>
    </topbar>

    <main>
      <section class="promotion-target">
        <header>
          推广目标设置
          <p>
            按点击付费，展现免费，288元一键投放百度，神马等多渠道
            <el-popover trigger="hover">
              <img :src="PRE_IMG_PROMOTION" width="638" height="405">
              <a slot="reference">查看详情</a>
            </el-popover>
          </p>
        </header>

        <div>
          <label>投放页面：</label>
          <div class="landingpage">
            <div style="margin-bottom: 10px">
              <el-radio-group v-model="newPromotion.landingType" size="small">
                <el-radio-button v-for="option of landingTypeOpts" :key="option.value" :label="option.value">{{option.label}}</el-radio-button>
              </el-radio-group>
            </div>
            <div>
              <user-ad-selector :type="adSelectorType"
                v-if="newPromotion.landingType === 0"
                :all-areas="allAreas" :limit-mvp="false"
                :selected-id="newPromotion.landingPageId"
                @select-ad="ad => onSelectAd(ad)"
              />

              <qiqiaoban-page-selector
                v-if="newPromotion.landingType === 1"
                :value="newPromotion.landingPage"
                @change="setLandingPage"
              />
            </div>
          </div>
        </div>
        <div>
          <label>投放城市：</label>
          <div>
            <el-tag type="success" closable class="kw-tag"
              v-for="c in newPromotion.areas" :key="c"
              @close="removeArea(c)">
              {{ formatterArea(c) }}
            </el-tag>
            <i class="el-icon-plus" @click="areaDialogVisible = true"></i>
          </div>
        </div>

        <promotion-area-limit-tip :all-areas="allAreas" :selected-areas="newPromotion.areas" />
      </section>

      <section class="creative">
        <header><promotion-creative-tip /> </header>
        <creative-editor
          :platforms="newPromotion.sources"
          :title="newPromotion.creativeTitle"
          :content="newPromotion.creativeContent"
          @change="handleCreativeValueChange"
          @error="handleCreativeError"
        />
      </section>

      <section class="keyword">
        <header>选取推广关键词</header>
        <p class="tip">建议选取20个以上关键词，关键词越多您的创意被展现的机会越多。根据当月数据，为您推荐如下关键词</p>
        <div class="kw-tag-container">
          <el-tag class="kw-tag" v-for="(kw, index) in newPromotion.keywords" :key="index" closable @close="removeKeyword(index)">{{kw.word}}</el-tag>
          <el-autocomplete
            v-model="queryWord"
            :debounce="600"
            :fetch-suggestions="fetchRecommends"
            placeholder="添加自定义词"
            @select="selectRecommend"
            :trigger-on-focus="false"
            size="small"
          />
        </div>
      </section>

      <section class="price">
        <header>设置预算</header>
        <div class="kw-price">
          <label>关键词出价<cpc-price-tip />：</label>
          <el-input type="number"
            :value="f2y(kwPrice) || f2y(recommendKwPrice)"
            @change="onKwPriceChange"
            class="input"
            size="small"
          >
            <template slot="append">元</template>
          </el-input>
          <span class="tip">（关键词出价区间为 [2, 999] 元）</span>
        </div>

        <div class="platform">
          <label>选择渠道
            <el-tooltip
              style="cursor:pointer;"
              content="您可以根据需求选择一个或多个渠道展示您的广告。不同渠道会分开建立投放计划，您可以在管理推广计划页面对您的计划进行管理。"
              placement="right">
              <i class="el-icon-question"></i>
            </el-tooltip>：
          </label>
          <el-checkbox-group v-model="newPromotion.sources" size="small" class="platform-checkbox">
            <el-checkbox v-for="(opt, index) in semPlatformOpts" :key="index" :label="opt.value">{{opt.label}}</el-checkbox>
          </el-checkbox-group>
          <p v-if="isShenmaChecked" class="tip warning">神马渠道仅支持移动端, 禁止投放搬家、金融类（包括但不限于担保贷款）信息</p>
        </div>

        <div class="budget">
          <label>单渠道日预算：</label>
          <el-input type="number"
            :value="f2y(newPromotion.dailyBudget)"
            @change="onBudgetChange"
            class="input"
            size="small"
          >
            <template slot="append">元</template>
          </el-input>
          <p class="tip">（根据您选取的关键词，最低预算为<strong class="red">{{ f2y(predictedInfo.minDailyBudget) }} </strong>元）</p>
        </div>
        <p v-if="usableBalance <= 0" class="tip">
          扣除其余有效计划日预算后，您的推广资金可用余额为0元，请<router-link :to="{name: 'qwt-charge', query: {mode: 'charge-only'}}">充值</router-link>
        </p>
        <p v-else class="tip">
          扣除其余有效计划日预算后，您的推广资金可用余额为￥{{f2y(usableBalance)}}元，可消耗<strong class="red strong">{{predictedInfo.days}}</strong>天
        </p>
        <contract-ack type="content-rule" />
        <div>
          <el-button type="primary"
            :disabled="isCreating"
            @click="createPromotion">
            创建推广
          </el-button>
        </div>
        <promotion-charge-tip></promotion-charge-tip>
      </section>
    </main>

    <area-selector type="qwt" :all-areas="allAreas"
      :areas="newPromotion.areas"
      :visible="areaDialogVisible"
      :enable-china="false"
      @ok="onChangeAreas"
      @cancel="areaDialogVisible = false"
    />

    <charge-dialog
      :visible="chargeDialogVisible"
      @cancel="gotoPromotionList"
    />
  </div>
</template>

<script>
import { Message } from 'element-ui'
import uuid from 'uuid/v4'
import clone from 'clone'

import PromotionCreativeTip from 'com/widget//promotion-creative-tip'
import PromotionAreaLimitTip from 'com/widget/promotion-area-limit-tip'
import QiqiaobanPageSelector from 'com/common/qiqiaoban-page-selector'
import PromotionChargeTip from 'com/widget/promotion-charge-tip'
import PromotionRuleLink from 'com/widget/promotion-rule-link'
import CpcPriceTip from 'com/widget/cpc-price-tip'
import UserAdSelector from 'com/common/user-ad-selector'
import CreativeEditor from 'com/widget/creative-editor'
import AreaSelector from 'com/common/area-selector'
import ChargeDialog from 'com/common/charge-dialog'
import ContractAck from 'com/widget/contract-ack'
import Topbar from 'com/topbar'

import track from 'util/track'

import {
  assetHost
} from 'config'

import {
  f2y,
  toFloat,
  isQwtEnableCity,
  fmtAreasInQwt,
  getCnName,
  getCampaignPrediction
} from 'util'

import {
  createCampaign
} from 'api/fengming'

import {
  queryAds
} from 'api/fengming-mvp'

import {
  SEM_PLATFORM_SHENMA,
  landingTypeOpts,
  semPlatformOpts
} from 'constant/fengming'

import {
  MIN_WORD_PRICE,
  MAX_WORD_PRICE
} from 'constant/keyword'

import { keywordPriceTip } from 'constant/tip'

import store from './store'

const promotionTemplate = {
  landingType: 0,
  landingPage: '',
  landingPageId: '',
  areas: [],

  creativeTitle: '',
  creativeContent: '',

  keywords: [],
  sources: semPlatformOpts.map(opt => opt.value),
  dailyBudget: 10000
}

export default {
  name: 'qwt-create-promotion',
  components: {
    PromotionCreativeTip,
    PromotionAreaLimitTip,
    QiqiaobanPageSelector,
    PromotionChargeTip,
    PromotionRuleLink,
    UserAdSelector,
    CreativeEditor,
    AreaSelector,
    ChargeDialog,
    ContractAck,
    CpcPriceTip,
    Topbar
  },
  fromMobx: {
    searchRecommends: () => store.searchRecommends,
    urlRecommends: () => store.urlRecommends,

    currentBalance: () => store.currentBalance,
    campaignsCount: () => store.campaignsCount,
    usableBalance: () => store.usableBalance
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
      newPromotion: clone(promotionTemplate),
      actionTrackId: uuid(),
      queryWord: '',
      creativeError: null,
      kwPrice: 0,

      searchRecommendsVisible: false,
      chargeDialogVisible: false,
      areaDialogVisible: false,

      landingTypeOpts,
      semPlatformOpts,
      isCreating: false,
      showPromotion: false,
      timeout: null,

      // PRE_IMG_PROMOTION: assetHost + 'promotion-advantage.png'
      PRE_IMG_PROMOTION: 'http://file.baixing.net/201807/0bf28bef5b6e0b476daed9da30e229e7.png'
    }
  },
  computed: {
    isShenmaChecked() {
      return this.newPromotion.sources.includes(SEM_PLATFORM_SHENMA)
    },

    adSelectorType() {
      return this.$route.query.adId ? 'reselect' : ''
    },
    predictedInfo() {
      const dailyBudget = this.newPromotion.dailyBudget

      if (!dailyBudget) {
        return {
          minDailyBudget: 10000,
          days: 0
        }
      }
      const { usableBalance, newPromotion } = this

      let prices = []
      if (this.kwPrice) {
        prices = newPromotion.keywords.map(kw => this.kwPrice)
      } else {
        prices = newPromotion.keywords.map(kw => this.recommendKwPrice)
      }

      const tempPredictedInfo = getCampaignPrediction(usableBalance, dailyBudget, prices)
      const sourcesLen = Math.max(1, this.newPromotion.sources.length)
      return {
        ...tempPredictedInfo,
        days:  (tempPredictedInfo.days / sourcesLen) | 0
      }
    },

    recommendKwPrice() {
      console.log(this.newPromotion.keywords.map(kw => kw.price))
      const max = Math.max.apply(null, this.newPromotion.keywords.map(kw => kw.price))
      return Math.min(Math.max(200, toFloat(max * 0.8, 0)), 99900)
    }
  },
  methods: {
    f2y,
    handleCreativeValueChange({title, content}) {
        this.newPromotion.creativeTitle = title
        this.newPromotion.creativeContent = content
    },
    handleCreativeError(message) {
      if(message) Message.error(message)
      this.creativeError = message
    },
    fetchRecommends(query, cb) {
      query = query.trim()
      if (query) {
        store.recommendByWord(query, this.newPromotion.areas).then(
          () => {
            cb(this.searchRecommends)
          }
        )
      }
    },

    selectRecommend(item) {
      const { keywords } = this.newPromotion
      if (keywords.find(kw => kw.word === item.word)) {
        Message.warning('已选择该关键词')
      } else {
        keywords.push(item)
        this.queryWord = ''
      }
    },

    removeKeyword(index) {
      this.newPromotion.keywords.splice(index, 1)
    },

    onKwPriceChange(val) {
      this.kwPrice = toFloat(val) * 100
    },

    onBudgetChange(val) {
      this.newPromotion.dailyBudget = toFloat(val) * 100
    },

    setLandingPage(url) {
      this.newPromotion.landingPage = url
      this.newPromotion.areas = ['quanguo']
    },

    async onSelectAd(ad) {
      const { allAreas } = this

      if (isQwtEnableCity(ad.city, allAreas)) {
        this.newPromotion.areas = [ad.city]
      }

      this.newPromotion.landingPageId = ad.adId
      this.newPromotion.landingPage = ad.url

      await this.recommendByUrl()

      this.newPromotion.creativeTitle = ad.title && ad.title.slice(0, 24)
      this.newPromotion.creativeContent = ad.content && ad.content.slice(0, 39)
    },

    async createPromotion() {
      if (this.isCreating) {
        return Message.warning('正在创建中, 请稍等一小会 ~')
      }

      this.isCreating = true

      const { actionTrackId, userInfo } = this

      track({
        roles: userInfo.roles.map(r => r.name).join(','),
        action: 'click-button: create-campaign',
        baixingId: userInfo.baixingId,
        time: Date.now() / 1000 | 0,
        baxId: userInfo.id,
        actionTrackId
      })

      try {
        await this._createPromotion()
      } finally {
        this.isCreating = false
      }
    },

    async _createPromotion() {
      const { currentBalance, allAreas } = this

      const p = clone(this.newPromotion)

      p.dailyBudget = p.dailyBudget

      const pp = this.predictedInfo.minDailyBudget

      if (p.dailyBudget < pp) {
        return Message.error(`推广日预算需大于 ${f2y(pp)} 元`)
      }
      if (p.dailyBudget > 10000000 * 100) {
        return Message.error('推广日预算太高啦！您咋这么土豪呢~')
      }

      if (!p.landingPage) {
        return Message.error('请填写投放页面')
      }

      if (this.creativeError) {
        return Message.error(this.creativeError)
      }

      if (!p.creativeTitle || !p.creativeContent) {
        return Message.error('请填写创意')
      }

      if (!p.keywords.length) {
        return Message.error('请填写关键字')
      }

      for (const w of p.keywords) {
        if (w.price < MIN_WORD_PRICE || w.price > MAX_WORD_PRICE) {
          return Message.error(keywordPriceTip)
        }
      }

      if (!p.areas.length) {
        return Message.error('请选择投放区域')
      }

      if (this.kwPrice) {
        if (this.kwPrice < 200 || this.kwPrice > 99900) {
          return Message.error('关键词价格需在[2, 999]区间内')
        } else {
          p.keywords.forEach(kw => {
            kw.price = this.kwPrice
          })
        }
      } else {
        p.keywords.forEach(kw => {
          kw.price = this.recommendKwPrice
        })
      }

      console.log(`创建计划参数：`, p)

      await createCampaign(fmtAreasInQwt(p, allAreas))

      Message.success('创建成功')

      store.clearStore()

      if (p.dailyBudget > currentBalance) {
        this.chargeDialogVisible = true
      }

      setTimeout(() => {
        this.gotoPromotionList()
      }, 1000)
    },
    async recommendByWord() {
      const { queryWord, newPromotion } = this

      if (!queryWord) {
        return Message.error('请输入查询关键词')
      }
      await store.recommendByWord(queryWord, newPromotion.areas)
    },

    async recommendByUrl(newLandingPage = this.newPromotion.landingPage, areas = this.newPromotion.areas) {
      if (newLandingPage) {
        await store.recommendByUrl(newLandingPage, areas)
        this.newPromotion.keywords = this.urlRecommends
      }
    },
    gotoPromotionList() {
      this.chargeDialogVisible = false

      this.$router.push({
        name: 'qwt-promotion-list'
      })
    },

    onLandingTypeChange(typeId) {
      const { landingType } = this.newPromotion
      if (landingType === typeId) {
        return
      }

      this.newPromotion.landingType = typeId

      if ([1, 4].includes(typeId)) {
        this.newPromotion.landingPage = ''
      }
    },

    async onChangeAreas(areas) {
      this.newPromotion.areas = [...areas]
      this.areaDialogVisible = false
      await this.recommendByUrl()
    },

    formatterArea(name) {
      const { allAreas } = this
      return getCnName(name, allAreas)
    },

    async removeArea(c) {
      this.newPromotion.areas = [
        ...this.newPromotion.areas.filter(i => i !== c)
      ]
      await this.recommendByUrl()
    }
  },

  async mounted() {
    await Promise.all([
      store.getCurrentBalance(),
      store.getCampaignsCount(),
      store.getUsableBalance()
    ])

    // 主站个人中心跳转 case
    const { adId } = this.$route.query
    if (adId) {
      const result = await queryAds({
        limitMvp: false,
        adIds: [adId],
        limit: 1
      })
      const ad = result.ads && result.ads[0]
      if (ad) {
        await this.onSelectAd(ad)
      }
    }

    setTimeout(() => {
      // pv
      const { actionTrackId, userInfo } = this

      track({
        roles: userInfo.roles.map(r => r.name).join(','),
        action: 'enter-page: create-campaign',
        baixingId: userInfo.baixingId,
        time: Date.now() / 1000 | 0,
        baxId: userInfo.id,
        actionTrackId
      })
    }, 800)
  },

  beforeDestroy() {
    store.clearStore()
  },

  destroyed() {
    clearTimeout(this.timeout)
  }
}
</script>

<style scoped lang="postcss">
@import 'cssbase/mixin';

.input {
  width: 150px;
}

strong.red {
  color: red;
  margin: 0 5px;
  &.strong {
    font-size: 16px;
  }
}

.qwt-create-promotion {
  font-size: 14px;
  color: #6a778c;
  padding: 0 35px;
  width: 100%;

  & > main {
    & > section:not(:last-child) {
      border-bottom: 1px solid #c0ccda;
    }

    & > section {
      margin-bottom: 30px;
      padding-bottom: 10px;

      & > header {
        color: #6a778c;
        font-weight: bold;
      }

      & > div {
        display: flex;
        align-items: baseline;
        margin: 12px 0;
      }
    }
  }
}
.kw-tag {
  margin-right: 5px;
  margin-top: 8px;
}
.kw-tag-container {
  max-width: 100%;
  display: flex;
  flex-wrap: wrap;
  & /deep/ .el-input__inner{
    margin-top: 8px;
  }
}
.el-icon-question {
  color: #6a778c;
  margin-left: 10px;
}
.tip {
  font-size: 12px;
}
.tip.warning {
  color: red;
}
.platform-checkbox {
  margin-right: 20px;
}
.el-icon-plus {
  cursor: pointer;
  font-size: 1.2em;
}
.promotion-target {
  & > header  {
    & > p {
      font-size: .88em;
      color: #333;
      display: inline-block;
      margin-left: 20px;
      font-weight: normal;
    }
    & a {
      margin-left: 10px;
      cursor: pointer;
      color: rgb(21, 164, 250);
    }
  }
}
</style>
