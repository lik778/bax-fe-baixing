
<template>
  <div class="qwt-update-promotion">
    <topbar :user-info="userInfo">
      <label slot="title">全网通 - 更新推广</label>
    </topbar>
    <main>
      <section>
        <header>推广目标设置</header>
        <div>
          <aside>投放渠道：</aside>
          <span>
            <el-button-group>
              <el-button v-if="false" :type="promotion.source === 0 ? 'primary' : ''"
                @click="clickSourceTip">
                百度
              </el-button>
              <el-button :type="promotion.source === 5 ? 'primary' : ''"
                @click="clickSourceTip">
                搜狗
              </el-button>
              <el-button v-if="false" :type="promotion.source === 1 ? 'primary' : ''"
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
                  @click="promotion.landingType = o.value"
                  :type="promotion.landingType === o.value ? 'primary' : ''">
                  {{ o.label }}
                </el-button>
              </el-button-group>
            </div>
            <div style="margin-top: 20px; width: 490px;">
              <el-input v-model.trim="promotion.landingPage"
                placeholder="请输入投放网址, 如: http://baixing.com">
              </el-input>
            </div>
          </span>
        </div>
        <div>
          <aside>投放城市：</aside>
          <span>
            <el-tag type="success" closable
              v-for="c in promotion.areas" :key="c"
              @close="removeArea(c)">
              {{ formatterArea(c) }}
            </el-tag>
            <i class="el-icon-plus"
              @click="areaDialogVisible = true">
            </i>
          </span>
        </div>
      </section>
      <section>
        <header>推广物料设置</header>
        <div>
          <aside>推广标题:</aside>
            <span>
              <el-input type="text" placeholder="请输入标题 ~ (字数限制为9-25个字)" style="width: 420px"
                v-model="promotion.creativeTitle">
              </el-input>
            </span>
        </div>
        <div>
          <aside style="align-items: flex-start; padding-top: 5px;">
            推广内容:
          </aside>
          <span>
            <el-input type="textarea" placeholder="请输入内容 ~ (字数限制为9-40个字)"
              :rows="5" style="width: 420px"
              v-model="promotion.creativeContent">
            </el-input>
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
        <h4>已经设置的关键词</h4>
        <keyword-list :words="currentKeywords"
          :selectable="false" deletable
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
        <keyword-list v-if="newaddedWordsVisible" :words="recommendedWords"
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
              v-model="promotion.validTime">
            </el-date-picker>
          </span>
        </div>
        <div>
          <aside>设置推广日预算:</aside>
          <span>
            <el-input type="number" placeholder="请输入每日最高预算"
              v-model="promotion.dailyBudget">
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
      :areas="promotion.areas"
      :visible="areaDialogVisible"
      @ok="onChangeAreas"
      @cancel="areaDialogVisible = false">
    </area-selector>
  </div>
</template>

<script>

import { Message } from 'element-ui'
import pick from 'lodash.pick'
import clone from 'clone'

import KeywordList from '../qwt-create-promotion/keyword-list'
import AreaSelector from 'com/common/area-selector'
import Topbar from 'com/topbar'

import { getCnName } from 'util/meta'
import {
  getCampaignPrediction,
  getCampaignValidTime
} from 'util/campaign'

import {
  toHumanTime,
  centToYuan
} from 'utils'

import {
  landingTypeOpts
} from 'constant/fengming'

import {
  checkCreativeContent,
  getRecommendedWords,
  getCurrentBalance,
  getCampaignInfo,
  updateCampaign,
  clearStore
} from './action'

import store from './store'

const emptyPromotion = {
  creativeContent: '',
  creativeTitle: '',
  dailyBudget: 0,
  landingPage: '',
  landingType: 0,
  validTime: [],
  keywords: [],
  areas: [],
  source: 5,
  //
  updatedKeywords: [],
  deletedKeywords: [],
  newKeywords: []
}

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
      promotion: clone(emptyPromotion),

      newaddedWordsVisible: false,
      areaDialogVisible: false,
      timeType: 'long', // long, custom
      queryWord: '',

      landingTypeOpts
    }
  },
  computed: {
    currentKeywords() {
      const {
        deletedKeywords,
        keywords
      } = this.promotion

      return keywords.filter(w => {
        return !deletedKeywords.map(i => i.id).includes(w.id)
      })
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
    id() {
      return this.$route.params.id
    }
  },
  methods: {
    async initCampaignInfo() {
      const info = await getCampaignInfo(this.id)

      info.dailyBudget = info.dailyBudget / 100 | 0
      if (info.timeRange && info.timeRange.length) {
        info.validTime = [
          toHumanTime(info.timeRange[0], 'YYYY-MM-DD'),
          toHumanTime(info.timeRange[1], 'YYYY-MM-DD')
        ]
      } else {
        info.validTime = []
      }

      if (info.creative) {
        info.landingType = info.creative.landingType
        info.landingPage = info.creative.landingPage
        info.creativeContent = info.creative.content
        info.creativeTitle = info.creative.title
        info.creative = undefined
      }

      this.promotion = {
        ...this.promotion,
        ...info
      }

      await getCurrentBalance()
    },
    clickSourceTip() {
      Message.warning('投放渠道不能修改')
    },
    updateExistWord(word) {
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
    async updatePromotion() {
      // TODO: 增量更新
      const p = pick(this.promotion, 'creativeContent', 'creativeTitle',
        'dailyBudget', 'landingPage', 'landingType', 'areas', 'validTime',
        'newKeywords', 'deletedKeywords', 'updatedKeywords')

      p.dailyBudget = p.dailyBudget * 100

      if (this.timeType === 'custom') {
        if (p.validTime.length) {
          p.validTime = getCampaignValidTime(p.validTime)
        } else {
          // return Message.error('请填写投放日期或选择长期投放')
          p.validTime = undefined
        }
      } else {
        p.validTime = [null, null]
      }

      await updateCampaign(this.id, p)

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
      const {
        creativeContent,
        creativeTitle
      } = this.promotion

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
        ...this.promotion.areas.filter(i => i !== c)
      ]
    },
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
