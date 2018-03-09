
<template>
  <div class="qwt-create-promotion">
    <topbar :user-info="userInfo">
      <label slot="title">全网通 - 新建推广</label>
      <flat-btn slot="right" @click.native="toggleTuoguanVisible({action: 'tuoguan:entry:qwt-create-promotion', actionTrackId, baixingId: userInfo.id})" class="tuoguan">托管服务</flat-btn>
    </topbar>
    <main>
      <section>
        <header>推广目标设置</header>
        <div>
          <aside>选择渠道：</aside>
          <span>
            <el-button-group>
              <el-button @click="newPromotion.source = 0"
                :type="newPromotion.source === 0 ? 'primary' : ''">
                百度
              </el-button>
              <el-button @click="newPromotion.source = 5"
                :type="newPromotion.source === 5 ? 'primary' : ''">
                搜狗
              </el-button>
              <el-button @click="newPromotion.source = 1"
                :type="newPromotion.source === 1 ? 'primary' : ''">
                360
              </el-button>
            </el-button-group>
          </span>
          <promotion-rule-link></promotion-rule-link>
        </div>
        <div>
          <aside style="align-items: flex-start; padding-top: 5px;">
            投放页面：
          </aside>
          <span class="landingpage">
            <div>
              <el-button-group>
                <el-button v-for="o of landingTypeOpts" :key="o.value"
                  @click="onLandingTypeChange(o.value)"
                  :type="newPromotion.landingType === o.value ? 'primary' : ''">
                  {{ o.label }}
                </el-button>
              </el-button-group>
            </div>
            <div style="margin-top: 20px; width: 560px;">
              <el-input v-if="![1, 4].includes(newPromotion.landingType)"
                v-model.trim="newPromotion.landingPage"
                placeholder="输入投放网址，如：http://baixing.com 网址有误会影响投放效果，请检查后再投放"
                @blur="getCreativeWords()">
              </el-input>

              <qiqiaoban-page-selector
                v-if="newPromotion.landingType === 1"
                v-model="newPromotion.landingPage"
                @change="getCreativeWords">
              </qiqiaoban-page-selector>

              <cashcow-page-selector
                v-if="newPromotion.landingType === 4"
                v-model="newPromotion.landingPage"
                @change="getCreativeWords">
              </cashcow-page-selector>
            </div>
          </span>
        </div>
        <div>
          <aside>投放城市：</aside>
          <span>
            <el-tag type="success" closable
              v-for="c in newPromotion.areas" :key="c"
              @close="removeArea(c)">
              {{ formatterArea(c) }}
            </el-tag>
            <i class="el-icon-plus"
              @click="areaDialogVisible = true">
            </i>
          </span>
        </div>
        <promotion-area-limit-tip :all-areas="allAreas">
        </promotion-area-limit-tip>
        <div>
          <aside>投放时段：</aside>
          <span>
            <label class="duration-type">
              {{ getDurationType() }}
            </label>
            <el-button type="primary" size="small"
              @click="durationSelectorVisible = true">
              设置
            </el-button>
          </span>
        </div>
      </section>
      <section>
        <promotion-creative-tip></promotion-creative-tip>
        <div>
          <aside>推广标题:</aside>
            <span>
              <text-limit-tip :rest="25 - newPromotion.creativeTitle.length">
                <el-input slot="input" type="text" style="width: 420px"
                  placeholder="请输入标题 ~ (字数限制为9-25个字)"
                  v-model="newPromotion.creativeTitle">
                </el-input>
              </text-limit-tip>
            </span>
        </div>
        <div>
          <aside style="align-items: flex-start; padding-top: 5px;">
            推广内容:
          </aside>
          <span>
            <text-limit-tip :rest="40 - newPromotion.creativeContent.length">
              <el-input slot="input" type="textarea"
                :rows="5" style="width: 420px"
                :placeholder="creativeContentPlaceholder"
                v-model="newPromotion.creativeContent">
              </el-input>
            </text-limit-tip>
          </span>
        </div>
        <footer>
          <el-button type="primary" @click="checkCreativeContent">
            检查推广是否可用
          </el-button>
        </footer>
      </section>
      <section class="keyword">
        <header>选取推广关键词</header>
        <h4>建议选取20个以上关键词，关键词越多您的创意被展现的机会越多。根据当月数据，为您推荐如下关键词</h4>
        <keyword-list :words="creativeWords"
          :selected-words="newPromotion.creativeWords"
          @update-word="updateCreativeWord"
          @select-words="words => newPromotion.creativeWords = [...words]">
        </keyword-list>
        <h3>
          <label>若没有您满意的关键词，</label>
          <a @click="switchWordsVisible">点此自定义添加</a>
        </h3>
        <div class="recommend"
          v-if="recommendedWordsVisible">
          <span>
            <el-input placeholder="请输入关键词" v-model.trim="queryWord">
            </el-input>
          </span>
          <el-button type="primary" @click="queryRecommendedWords">
            查询
          </el-button>
          <strong>
            （请优先添加较为核心的关键词，关键词长度不宜超过5个字，不区分大小写。）
          </strong>
        </div>
        <keyword-list v-if="recommendedWordsVisible" :words="addibleWords"
          :selected-words="newPromotion.recommendedWords"
          @update-word="updateRecommendedWord"
          @select-words="words => newPromotion.recommendedWords = [...words]">
        </keyword-list>
        <div class="mobile-ratio">
          <section>
            选择投放移动端的出价比例
          </section>
          <section>
            <span>
              <el-input placeholder="默认为1" v-model="newPromotion.mobilePriceRatio">
              </el-input>
            </span>
            <span>
              (请输入 0.1-9.9 之间的数字)
            </span>
          </section>
          <promotion-mobile-ratio-tip></promotion-mobile-ratio-tip>
        </div>
      </section>
      <section class="timing">
        <header>设置时长和预算</header>
        <div>
          <aside>投放时间:</aside>
          <span>
            <el-button-group>
              <el-button :type="timeType === 'long' ? 'primary' : ''"
                @click="timeType = 'long'">
                长期投放
              </el-button>
              <el-button :type="timeType === 'custom' ? 'primary' : ''"
                @click="timeType = 'custom'">
                定时投放
              </el-button>
            </el-button-group>
          </span>
          <span>
            <el-date-picker v-if="timeType === 'custom'"
              type="daterange" placeholder="选择日期范围"
              :picker-options="{disabledDate}"
              v-model="newPromotion.validTime">
            </el-date-picker>
          </span>
        </div>
        <div>
          <aside>设置推广日预算:</aside>
          <span>
            <el-input type="number" placeholder="请输入每日最高预算"
              v-model="newPromotion.dailyBudget">
            </el-input>
          </span>
          <i>元</i>
          <span>
            （根据您选取的关键词，最低预算为<p>{{ predictedInfo.dailyBudget }}</p>元）
          </span>
        </div>
        <h3>
          {{ `您的推广资金余额：￥${ centToYuan(currentBalance) } 元，可消耗` }}
          <strong>{{ predictedInfo.duration }}</strong>天
        </h3>
        <contract-ack type="content-rule"></contract-ack>
        <div>
          <el-button v-if="false" type="primary">
            先去充值
          </el-button>
          <el-button type="primary"
            :disabled="isCreating"
            @click="createPromotion">
            创建推广
          </el-button>
        </div>
        <promotion-charge-tip></promotion-charge-tip>
      </section>
    </main>
    <area-selector :all-areas="allAreas"
      :areas="newPromotion.areas" type="qwt"
      :visible="areaDialogVisible"
      :enable-china="false"
      @ok="onChangeAreas"
      @cancel="areaDialogVisible = false">
    </area-selector>
    <duration-selector
      :visible="durationSelectorVisible"
      :platform="newPromotion.source"
      schedule="all"
      @change="onChangeDuration"
      @hide="durationSelectorVisible = false">
    </duration-selector>

    <transition name="slide-fade">
      <div class="tuoguan-promotion" v-show="showPromotion">
        <i @click="closePromotion" class="el-icon-close"></i>
        <el-button class="tuoguan-btn" type="text" @click="toggleTuoguanVisible({action: 'tuoguan:entry:popover', actionTrackId, baixingId: userInfo.id})"></el-button>
      </div>
    </transition>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import uuid from 'uuid/v4'
import clone from 'clone'

import PromotionMobileRatioTip from 'com/widget/promotion-mobile-ratio-tip'
import PromotionAreaLimitTip from 'com/widget/promotion-area-limit-tip'
import QiqiaobanPageSelector from 'com/common/qiqiaoban-page-selector'
import PromotionCreativeTip from 'com/widget/promotion-creative-tip'
import CashcowPageSelector from 'com/common/cashcow-page-selector'
import PromotionChargeTip from 'com/widget/promotion-charge-tip'
import PromotionRuleLink from 'com/widget/promotion-rule-link'
import DurationSelector from 'com/common/duration-selector'
import KeywordList from 'com/common/qwt-keyword-list'
import TextLimitTip from 'com/widget/text-limit-tip'
import AreaSelector from 'com/common/area-selector'
import ContractAck from 'com/widget/contract-ack'
import FlatBtn from 'com/common/flat-btn'
import Topbar from 'com/topbar'

import { fmtAreasInQwt, getCnName } from 'util/meta'
import { disabledDate } from 'util/element'
import track from 'util/track'
import {
  checkCampaignValidTime,
  getCampaignPrediction,
  getCampaignValidTime
} from 'util/campaign'
import {
  centToYuan
} from 'utils'

import {
  SEM_PLATFORM_BAIDU,
  SEM_PLATFORM_SOGOU,
  landingTypeOpts
} from 'constant/fengming'

import {
  creativeContentPlaceholder
} from 'constant/tip'

import {
  checkCreativeContent,
  getRecommendedWords,
  getCurrentBalance,
  getCreativeWords,
  createCampaign,
  clearStore,
  getCampaignsCount
} from './action'

import gStore from '../store'
import store from './store'

const emptyPromotion = {
  mobilePriceRatio: 1,
  creativeContent: '',
  creativeTitle: '',
  dailyBudget: 100, // 元
  landingPage: '',
  landingType: 0,
  validTime: [],
  keywords: [],
  areas: [],
  source: SEM_PLATFORM_BAIDU,
  //
  recommendedWords: [],
  creativeWords: []
}

const storageKey = 'user_close_tuoguan_promotion'
const notActiveTime = 25 * 60 * 1000

export default {
  name: 'qwt-create-promotion',
  store,
  components: {
    PromotionMobileRatioTip,
    PromotionAreaLimitTip,
    QiqiaobanPageSelector,
    PromotionCreativeTip,
    CashcowPageSelector,
    PromotionChargeTip,
    PromotionRuleLink,
    DurationSelector,
    AreaSelector,
    TextLimitTip,
    KeywordList,
    ContractAck,
    FlatBtn,
    Topbar
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
      newPromotion: clone(emptyPromotion),
      actionTrackId: uuid(),
      timeType: 'long', // long, custom
      queryWord: '',

      recommendedWordsVisible: false,
      durationSelectorVisible: false,
      areaDialogVisible: false,

      creativeContentPlaceholder,
      landingTypeOpts,

      isCreating: false,

      showPromotion: false,
      timeout: null,
      failCount: 0
    }
  },
  computed: {
    isFirstCampaign() {
      return this.campaignsCount === 0
    },
    predictedInfo() {
      const {
        currentBalance,
        newPromotion
      } = this

      const {
        recommendedWords,
        creativeWords
      } = newPromotion

      const prices = [...recommendedWords, ...creativeWords]
        .map(k => k.price)

      return getCampaignPrediction(currentBalance, prices)
    },
    addibleWords() {
      const words = this.creativeWords.map(w => w.word.toLowerCase())

      return this.recommendedWords.filter(w => !words.includes(w.word.toLowerCase()))
    }
  },
  methods: {
    closePromotion() {
      window.localStorage.setItem(storageKey, 'true')
      this.showPromotion = false
    },
    toggleTuoguanVisible(opts) {
      gStore.toggleTuoguanVisible(opts)
    },
    getDurationType() {
      const { schedule } = this.newPromotion
      if (!schedule) {
        return '全时段'
      }

      const sum = schedule.reduce((a, b) => a + b, 0)

      if (this.newPromotion.source === SEM_PLATFORM_SOGOU) {
        return sum < 3670009 ? '部分时段' : '全时段'
      }

      return sum < 117440505 ? '部分时段' : '全时段'
    },
    tryShowPromotion(sideEffect) {
      const has = window.localStorage.getItem(storageKey)
      if (has !== 'true') {
        this.showPromotion = true
        if (sideEffect) {
          track({
            ...sideEffect,
            baixingId: this.userInfo.id,
            url: window.location.href,
            time: Date.now() / 1000 | 0,
            actionTrackId: this.actionTrackId
          })
        }
      }
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
        this.failCount = 0
      } catch (error) {
        // 创建出错三次以上，给提示
        this.failCount++
        if (this.failCount > 3) {
          this.tryShowPromotion({
            action: 'tuoguan:popup:fail-3-times'
          })
        }
      } finally {
        this.isCreating = false
      }
    },
    async _createPromotion() {
      const { allAreas } = this

      const p = clone(this.newPromotion)

      const pp = this.predictedInfo.dailyBudget
      if (p.dailyBudget < pp) {
        throw Message.error(`推广日预算需大于 ${pp} 元`)
      }

      p.dailyBudget = p.dailyBudget * 100

      if (this.timeType === 'custom') {
        if (checkCampaignValidTime(p.validTime) === 'custom') {
          p.validTime = getCampaignValidTime(p.validTime)
        } else {
          throw Message.error('请填写投放日期或选择长期投放')
        }
      } else {
        p.validTime = [null, null]
      }

      p.keywords = [
        ...p.recommendedWords,
        ...p.creativeWords
      ]

      p.mobilePriceRatio = parseFloat(p.mobilePriceRatio)
      if (!(p.mobilePriceRatio >= 0.1 && p.mobilePriceRatio <= 9.9)) {
        throw Message.error('请设置合理的移动端出价比例')
      }

      if (!p.landingPage) {
        throw Message.error('请填写投放页面')
      }

      if (!p.keywords.length) {
        throw Message.error('请填写关键字')
      }

      for (const w of p.keywords) {
        // if (w.price * 2 < w.originPrice) {
        //   return Message.error(`关键字: ${w.word} 出价低于 ${(w.originPrice / 200).toFixed(2)}, 请调高出价`)
        // }
        if (w.price < 100) {
          throw Message.error(`关键字: ${w.word} 出价不得低于 1元, 请调高出价`)
        }
      }

      if (!p.areas.length) {
        throw Message.error('请选择城市')
      }

      if (!p.creativeTitle) {
        throw Message.error('请填写创意标题')
      }

      if (p.creativeTitle.length < 9 ||
        p.creativeTitle.length > 25) {
        throw Message.error('创意标题需要在9-25个字')
      }

      if (!p.creativeContent) {
        throw Message.error('请填写创意内容')
      }

      if (p.creativeContent.length < 9 ||
        p.creativeContent.length > 40) {
        throw Message.error('创意内容需要在9-40个字')
      }

      const res = await checkCreativeContent({
        creativeContent: p.creativeContent,
        creativeTitle: p.creativeTitle,
        platform: p.source
      })

      if (res.result) {
        throw Message.error(res.hint)
      }

      await createCampaign(fmtAreasInQwt(p, allAreas))

      Message.success('创建成功')

      await clearStore()

      this.$router.push({
        name: 'qwt-promotion-list'
      })
    },
    async queryRecommendedWords() {
      const { queryWord } = this

      if (!queryWord) {
        return Message.error('请输入查询关键词')
      }

      await getRecommendedWords(queryWord)
    },
    async checkCreativeContent() {
      const {
        creativeContent,
        creativeTitle,
        source
      } = this.newPromotion

      if (!creativeContent) {
        return Message.error('请填写推广内容')
      }

      if (!creativeTitle) {
        return Message.error('请填写推广标题')
      }

      const data = await checkCreativeContent({
        platform: source,
        creativeContent,
        creativeTitle
      })

      if (!data.result) {
        Message.success(data.hint)
      } else {
        return Message.error(data.hint)
      }
    },
    updateRecommendedWord(word) {
      this.newPromotion.recommendedWords = this.newPromotion.recommendedWords.map(w => {
        if (w.word === word.word) {
          return {
            ...w,
            price: word.price
          }
        } else {
          return {...w}
        }
      })
    },
    updateCreativeWord(word) {
      this.newPromotion.creativeWords = this.newPromotion.creativeWords.map(w => {
        if (w.word === word.word) {
          return {
            ...w,
            price: word.price
          }
        } else {
          return {...w}
        }
      })
    },
    async getCreativeWords(newLandingPage = this.newPromotion.landingPage) {
      if (newLandingPage) {
        await getCreativeWords(newLandingPage)
      }
    },
    switchWordsVisible() {
      this.recommendedWordsVisible = !this.recommendedWordsVisible
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
    onChangeAreas(areas) {
      this.newPromotion.areas = [...areas]
      this.areaDialogVisible = false
    },
    onChangeDuration(durations) {
      this.newPromotion.schedule = durations
    },
    formatterArea(name) {
      const { allAreas } = this
      return getCnName(name, allAreas)
    },
    removeArea(c) {
      this.newPromotion.areas = [
        ...this.newPromotion.areas.filter(i => i !== c)
      ]
    },
    disabledDate,
    centToYuan
  },
  async mounted() {
    await Promise.all([getCurrentBalance(), getCampaignsCount()])

    if (this.isFirstCampaign) {
      this.tryShowPromotion({
        action: 'tuoguan:popover:first-time-create'
      })
    }

    setTimeout(() => {
      const { actionTrackId, userInfo } = this

      track({
        roles: userInfo.roles.map(r => r.name).join(','),
        action: 'enter-page: create-campaign',
        baixingId: userInfo.baixingId,
        time: Date.now() / 1000 | 0,
        baxId: userInfo.id,
        actionTrackId
      })
    }, 1200)

    // 25分钟未离开页面，出现提示
    this.timeout = setTimeout(() => {
      this.tryShowPromotion({
        action: 'tuoguan:popover:linger-over-25'
      })
    }, notActiveTime)
  },

  destroyed() {
    clearTimeout(this.timeout)
  }
}
</script>

<style scoped>
.el-icon-plus {
  cursor: pointer;
}

.el-tag {
  margin-right: 5px;
}

.duration-type {
  color: #6a778c;
  font-size: 14px;
}

.qwt-create-promotion {
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
      }

      & > div {
        display: flex;
        margin: 20px 0;

        & > aside:first-child {
          display: flex;
          align-items: center;
          margin-right: 20px;
          color: #6a778c;
          font-size: 14px;
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

      & > div.recommend {
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

      & > div.mobile-ratio {
        display: block;

        & > section:first-child {
          font-size: 14px;
          line-height: 1;
          color: #424344;
        }

        & > section:nth-child(2) {
          margin-top: 16px;

          & > span:last-child {
            margin-left: 14px;
            font-size: 13px;
            color: #404e61;
          }
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
          align-items: center;
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
          color: #ff4401;
          font-size: 18px;
        }
      }
    }
  }
}

.tuoguan {
  position: relative;
  right: 10px;
}

.slide-fade-enter-active {
  transition: all .4s ease;
}

.slide-fade-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(100px);
}

.tuoguan-promotion {
  background-image: url(http://file.baixing.net/201801/47f063038bdbb67660a114de96958e2f.png);
  background-position: center;
  background-repeat: no-repeat;
  width: 154px;
  height: 216px;
  position: fixed;
  right: 80px;
  bottom: 10px;

  & > .el-icon-close {
    position: absolute;
    right: 3px;
    top: 29px;
    cursor: pointer;
    color: #666;
  }

  & > .tuoguan-btn {
    background-image: url(http://file.baixing.net/201801/26a639493c25bc3d8f62c54848b312c2.png);
    background-repeat: no-repeat;
    background-position: center;
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 128px;
    height: 30px;
  }
}
</style>
