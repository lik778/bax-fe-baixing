
<template>
  <div class="qwt-update-promotion">
    <topbar :user-info="userInfo">
      <label slot="title">全网通 - 更新推广</label>
    </topbar>
    <main>
      <h3>推广计划: {{ id }}</h3>
      <section>
        <header>推广目标设置</header>
        <div>
          <aside>投放渠道：</aside>
          <span>
            <el-button-group>
              <el-button v-if="false" :type="getProp('source') === 0 ? 'primary' : ''"
                @click="clickSourceTip">
                百度
              </el-button>
              <el-button :type="getProp('source') === 5 ? 'primary' : ''"
                @click="clickSourceTip">
                搜狗
              </el-button>
              <el-button :type="getProp('source') === 1 ? 'primary' : ''"
                @click="clickSourceTip">
                360
              </el-button>
            </el-button-group>
          </span>
        </div>
        <div>
          <aside style="align-items: flex-start; padding-top: 5px;">
            投放页面：
          </aside>
          <span class="landingpage">
            <div>
              <el-button-group>
                <el-button v-for="o of landingTypeOpts" :key="o.value"
                  :type="getProp('landingType') === o.value ? 'primary' : ''"
                  @click="clickLandingType(o.value)">
                  {{ o.label }}
                </el-button>
              </el-button-group>
            </div>
            <div style="margin-top: 20px;">
              <el-input :value="getProp('landingPage')" style="width: 490px;"
                placeholder="请输入投放网址, 如: http://baixing.com"
                :disabled="isAuthing"
                @change="v => promotion.landingPage = v.trim()">
              </el-input>
              <p v-if="isAuthing" class="authing-tip">
                您的推广在审核中，审核通过后可修改落地页，感谢配合！
              </p>
            </div>
          </span>
        </div>
        <div>
          <aside>投放城市：</aside>
          <span>
            <el-tag type="success" closable
              v-for="c in getProp('areas')" :key="c"
              @close="removeArea(c)">
              {{ formatterArea(c) }}
            </el-tag>
            <i class="el-icon-plus"
              @click="areaDialogVisible = true">
            </i>
          </span>
        </div>
      </section>
      <section class="creative">
        <header>推广物料设置</header>
        <div>
          <aside>推广标题:</aside>
          <span>
            <el-input type="text" style="width: 420px"
              placeholder="请输入标题 ~ (字数限制为9-25个字)"
              :disabled="isAuthing"
              :value="getProp('creativeTitle')"
              @change="v => promotion.creativeTitle = v">
            </el-input>
            <p v-if="isAuthing" class="authing-tip">
              您的推广在审核中，审核通过后可修改创意，感谢配合！
            </p>
          </span>
        </div>
        <div>
          <aside style="align-items: flex-start; padding-top: 5px;">
            推广内容:
          </aside>
          <span>
            <el-input type="textarea" placeholder="请输入内容 ~ (字数限制为9-40个字)"
              :disabled="isAuthing"
              :rows="5" style="width: 420px"
              :value="getProp('creativeContent')"
              @change="v => promotion.creativeContent = v">
            </el-input>
          </span>
          <p>{{ originPromotion.refuseReason }}</p>
        </div>
        <footer>
          <el-button type="primary" @click="checkCreativeContent">
            检查推广是否可用
          </el-button>
        </footer>
      </section>
      <section class="keyword">
        <header>选取推广关键词</header>
        <h4>
          <span>已经设置的关键词</span>
          <label>当前投放中: {{ currentKeywords.length }}个</label>
        </h4>
        <keyword-list :words="currentKeywords"
          :selectable="false" deletable
          :show-prop-show="false"
          :show-prop-status="true"
          @update-word="updateExistWord"
          @delete-word="word => promotion.deletedKeywords.push(word)">
        </keyword-list>
        <h3>
          <label>关键词不够？</label>
          <a @click="switchWordsVisible">点此自定义添加</a>
        </h3>
        <div v-if="newaddedWordsVisible">
          <span>
            <el-input placeholder="请输入关键词" v-model="queryWord">
            </el-input>
          </span>
          <el-button type="primary" @click="queryRecommendedWords">
            查询
          </el-button>
          <strong>
            （请优先添加较为核心的关键词，关键词长度不宜超过5个字，不区分大小写。）
          </strong>
        </div>
        <keyword-list v-if="newaddedWordsVisible" :words="addibleWords"
          :selected-words="promotion.newKeywords"
          @update-word="updateNewWord"
          @select-words="words => promotion.newKeywords = [...words]">
        </keyword-list>
      </section>
      <section class="timing">
        <header>设置时长和预算</header>
        <div>
          <aside>投放时间:</aside>
          <span>
            <el-button-group>
              <el-button :type="timeType === 'long' ? 'primary' : ''"
                @click="setTimeType('long')">
                长期投放
              </el-button>
              <el-button :type="timeType === 'custom' ? 'primary' : ''"
                @click="setTimeType('custom')">
                定时投放
              </el-button>
            </el-button-group>
          </span>
          <span>
            <el-date-picker v-if="timeType === 'custom'"
              type="daterange" placeholder="选择日期范围"
              :picker-options="{disabledDate}"
              :value="getProp('validTime')"
              @input="v => promotion.validTime = v">
            </el-date-picker>
          </span>
        </div>
        <div>
          <aside>设置推广日预算:</aside>
          <span>
            <el-input type="number" placeholder="请输入每日最高预算"
              :value="getProp('dailyBudget')"
              @change="v => promotion.dailyBudget = v">
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
        <h4>
          <el-checkbox :value="true"></el-checkbox>
          <label>我已阅读并同意遵守</label>
          <a>《百姓网站外推广用户协议》</a>
        </h4>
        <div>
          <el-button v-if="false" type="primary">
            先去充值
          </el-button>
          <el-button type="primary" @click="updatePromotion">
            更新推广
          </el-button>
        </div>
        <footer>
          <li>请注意：</li>
          <li>1. 预算不足时将有下线提醒（预算余额不足50元且当天23：59前未续费则下线）。如有剩余预算，将自动转入站外推广资金。</li>
          <li>2. 该资金无法用于购买其他付费产品，自产生当日起有效期为一年，超出有效期后，未用完部分将无法继续使用。</li>
          <a>常见问题解答</a>
        </footer>
      </section>
    </main>
    <area-selector :all-areas="allAreas"
      :areas="getProp('areas')"
      :visible="areaDialogVisible"
      :enable-china="false"
      @ok="onChangeAreas"
      @cancel="areaDialogVisible = false">
    </area-selector>
  </div>
</template>

<script>

import { Message } from 'element-ui'

import KeywordList from 'com/common/qwt-keyword-list'
import AreaSelector from 'com/common/area-selector'
import Topbar from 'com/topbar'

import { fmtAreasInQwt, getCnName } from 'util/meta'
import { disabledDate } from 'util/element'
import {
  checkCampaignValidTime,
  getCampaignPrediction,
  getCampaignValidTime
} from 'util/campaign'

import {
  centToYuan
} from 'utils'

import {
  checkCreativeContent,
  getRecommendedWords,
  getCurrentBalance,
  getCampaignInfo,
  updateCampaign,
  setTimeType,
  clearStore
} from './action'

import store from './store'

const isArray = Array.isArray

export default {
  name: 'qwt-update-promotion',
  store,
  components: {
    AreaSelector,
    KeywordList,
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
      newaddedWordsVisible: false,
      areaDialogVisible: false,
      queryWord: '',
      // 注: 此处逻辑比较容易出错, 此处 定义为 undefined 与 getXXXdata 处 密切相关
      // 注: 需要密切关注 更新 数据 的获取
      promotion: {
        // 创意
        landingType: undefined,
        landingPage: undefined,
        creativeTitle: undefined,
        creativeContent: undefined,
        // 活动
        areas: undefined,
        dailyBudget: undefined,
        validTime: undefined,
        // 关键词
        updatedKeywords: [],
        deletedKeywords: [],
        newKeywords: []
      }
    }
  },
  computed: {
    currentKeywords() {
      const { keywords } = this.originPromotion

      const {
        updatedKeywords,
        deletedKeywords
      } = this.promotion

      return keywords.filter(w => {
        return !deletedKeywords.map(i => i.id).includes(w.id)
      }).map(w => {
        for (const word of updatedKeywords) {
          if (word.id === w.id) {
            return {
              ...w,
              ...word
            }
          }
        }

        return {...w}
      })
    },
    addibleWords() {
      const words = this.currentKeywords.map(w => w.word)

      return this.recommendedWords.filter(w => !words.includes(w.word))
    },
    predictedInfo() {
      const {
        currentBalance,
        promotion
      } = this

      const {
        keywords = [],
        newKeywords = []
      } = promotion

      const prices = [...keywords, ...newKeywords]
        .map(k => k.price)

      return getCampaignPrediction(currentBalance, prices)
    },
    campaignStatus() {
      return this.originPromotion.status
    },
    isAuthing() {
      // 说明: sougou 审核中, 不允许修改创意; 但 360 可以
      if (this.getProp('source') === 1) {
        return false
      }

      return this.campaignStatus === 10
    },
    id() {
      return this.$route.params.id
    }
  },
  methods: {
    getProp(prop) {
      if (typeof this.promotion[prop] !== 'undefined') {
        return this.promotion[prop]
      }

      return this.originPromotion[prop]
    },
    async initCampaignInfo() {
      await Promise.all([
        getCampaignInfo(this.id),
        getCurrentBalance()
      ])
    },
    clickSourceTip() {
      Message.warning('投放渠道不能修改')
    },
    clickLandingType(type) {
      if (this.campaignStatus === 10) {
        return Message.warning('审核中, 无法修改')
      }

      this.promotion.landingType = type
    },
    updateExistWord(word) {
      const words = this.promotion.updatedKeywords.map(w => w.word)

      if (words.includes(word.word)) {
        this.promotion.updatedKeywords = this.promotion.updatedKeywords.map(w => {
          if (w.word === word.word) {
            return {
              ...w,
              price: word.price
            }
          } else {
            return {...w}
          }
        })
      } else {
        this.promotion.updatedKeywords.push({
          ...word
        })
      }
    },
    updateNewWord(word) {
      this.promotion.newKeywords = this.promotion.newKeywords.map(w => {
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
    getUpdatedCreativeData() {
      const {
        creativeContent: originCreativeContent,
        creativeTitle: originCreativeTitle,
        landingPage: originLandingPage,
        landingType: originLandingType
      } = this.originPromotion
      // 说明: 如下四个值, 要么都不传, 要么都传
      const {
        creativeContent,
        creativeTitle,
        landingPage,
        landingType
      } = this.promotion

      const changed = (now, ori) => {
        if (now === undefined) {
          return false
        }

        return now !== ori
      }

      if (creativeContent === '') {
        throw new Error('请填写推广内容')
      }

      if (creativeTitle === '') {
        throw new Error('请填写推广标题')
      }

      if (landingPage === '') {
        throw new Error('请填写投放页面')
      }

      if (changed(creativeContent, originCreativeContent) ||
        changed(creativeTitle, originCreativeTitle) ||
        changed(landingPage, originLandingPage) ||
        changed(landingType, originLandingType)) {
        return {
          landingType: this.getProp('landingType'),
          creativeContent: this.getProp('creativeContent'),
          creativeTitle: this.getProp('creativeTitle'),
          landingPage: this.getProp('landingPage')
        }
      }

      return {}
    },
    getUpdatedPromotionData() {
      // dailyBudget areas 要么都传, 要么都不传
      const { validTime: originValidTime } = this.originPromotion

      const {
        dailyBudget,
        validTime,
        areas
      } = this.promotion

      const data = {}

      const pp = this.predictedInfo.dailyBudget
      if ((dailyBudget !== undefined) && (dailyBudget < pp)) {
        throw new Error(`推广日预算需大于 ${pp} 元`)
      }

      if (areas && areas.length === 0) {
        throw new Error('请选择投放区域')
      }

      if (dailyBudget || (areas && areas.length)) {
        data.dailyBudget = this.getProp('dailyBudget') * 100 | 0
        data.areas = isArray(areas) ? [...areas] : this.originPromotion.areas
      }

      if (this.timeType === 'long') {
        data.validTime = [null, null]
      } else {
        if (validTime) {
          if (checkCampaignValidTime(validTime) === 'custom') {
            data.validTime = getCampaignValidTime(validTime)
          } else {
            // 比如: clear daterange -> undefined || [null, null]
            throw new Error('请填写投放日期或选择长期投放')
          }
        } else {
          // 比如: sb user 点击自定义投放 却 不选时间
          if (checkCampaignValidTime(originValidTime) === 'custom') {
            // ignore
          } else {
            throw new Error('请填写投放日期或选择长期投放')
          }
        }
      }

      return data
    },
    getUpdatedKeywordsData() {
      const {
        updatedKeywords,
        deletedKeywords,
        newKeywords
      } = this.promotion

      const data = {}

      if (updatedKeywords.length) {
        data.updatedKeywords = [...updatedKeywords]
      }

      if (deletedKeywords.length) {
        data.deletedKeywords = [...deletedKeywords]
      }

      if (newKeywords.length) {
        data.newKeywords = [...newKeywords]
      }

      return data
    },
    async updatePromotion() {
      let data = {}
      try {
        data = {
          ...this.getUpdatedCreativeData(),
          ...this.getUpdatedPromotionData(),
          ...this.getUpdatedKeywordsData()
        }
      } catch (err) {
        Message.error(err.message)
        return
      }

      // check price
      const {
        updatedKeywords = [],
        newKeywords = []
      } = data

      const words = [...updatedKeywords, ...newKeywords]

      for (const w of words) {
        if (w.price * 2 < w.originPrice) {
          return Message.error(`关键字: ${w.word} 出价低于 ${(w.originPrice / 200).toFixed(2)}, 请调高出价`)
        }
      }

      await updateCampaign(this.id, fmtAreasInQwt(data))

      Message.success('更新成功')

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
      const creativeContent = this.getProp('creativeContent')
      const creativeTitle = this.getProp('creativeTitle')

      if (!creativeContent) {
        return Message.error('请填写推广内容')
      }

      if (!creativeTitle) {
        return Message.error('请填写推广标题')
      }

      const data = await checkCreativeContent({
        creativeContent,
        creativeTitle
      })

      if (!data.result) {
        Message.success(data.hint)
      } else {
        Message.error(data.hint)
      }
    },
    switchWordsVisible() {
      this.newaddedWordsVisible = !this.newaddedWordsVisible
    },
    onChangeAreas(areas) {
      this.promotion.areas = [...areas]
      this.areaDialogVisible = false
    },
    formatterArea(name) {
      const { allAreas } = this
      return getCnName(name, allAreas)
    },
    removeArea(c) {
      this.promotion.areas = [
        ...this.getProp('areas').filter(i => i !== c)
      ]
    },
    disabledDate,
    setTimeType,
    centToYuan
  },
  watch: {
    '$route.params.id': async function(v, p) {
      if (v !== p) {
        await this.initCampaignInfo()
      }
    }
  },
  async mounted() {
    await this.initCampaignInfo()
  }
}

</script>

<style scoped>

.authing-tip {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  color: #ff4401;
}

.el-icon-plus {
  cursor: pointer;
}

.el-tag {
  margin-right: 5px;
}

.qwt-update-promotion {
  padding: 0 35px;
  width: 100%;

  & > main {
    & > h3 {
      margin: 5px 0 15px;
      font-size: 18px;
      font-weight: normal;
      color: #1f2d3d;
    }

    & > section:not(:last-child) {
      border-bottom: 1px solid #c0ccda;
    }

    & > section {
      margin-bottom: 30px;
      padding-bottom: 30px;

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

    & > section.creative {
      & > div:nth-child(3) {
        & > p {
          margin-left: 15px;
          font-size: 12px;
          line-height: 1.75;
          color: #ff1400;
        }
      }
    }

    & > section.keyword {
      & > h4 {
        margin: 20px 0 30px;
        color: #6a778c;
        font-size: 13px;
        font-weight: normal;

        & > label {
          margin-left: 10px;
          font-size: 12px;
          color: red;
        }
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
        line-height: 1.69;

        & > a {
          color: #0994ff;
          cursor: pointer;
        }
      }
    }
  }
}

</style>
