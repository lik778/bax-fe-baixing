
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
            <el-button-group>
              <el-button v-if="false" @click="newPromotion.source = 0"
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
        </div>
        <div>
          <aside style="align-items: flex-start; padding-top: 5px;">
            投放页面：
          </aside>
          <span class="landingpage">
            <div>
              <el-button-group>
                <el-button v-for="o of landingTypeOpts" :key="o.value"
                  @click="newPromotion.landingType = o.value"
                  :type="newPromotion.landingType === o.value ? 'primary' : ''">
                  {{ o.label }}
                </el-button>
              </el-button-group>
            </div>
            <div style="margin-top: 20px; width: 490px;">
              <el-input v-model.trim="newPromotion.landingPage"
                placeholder="请输入投放网址, 如: http://baixing.com"
                @blur="getCreativeWords">
              </el-input>
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
      </section>
      <section>
        <header>推广物料设置</header>
        <div>
          <aside>推广标题:</aside>
            <span>
              <el-input type="text" placeholder="请输入标题 ~ (字数限制为9-25个字)" style="width: 420px"
                v-model="newPromotion.creativeTitle">
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
              v-model="newPromotion.creativeContent">
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
        <h4>根据当月数据，为您推荐如下关键词</h4>
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
              (请输入 0.1-10 之间的数字)
            </span>
          </section>
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
        <h4>
          <el-checkbox :value="true"></el-checkbox>
          <label>我已阅读并同意遵守</label>
          <a>《百姓网站外推广用户协议》</a>
        </h4>
        <div>
          <el-button v-if="false" type="primary">
            先去充值
          </el-button>
          <el-button type="primary" @click="createPromotion">
            创建推广
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
      :areas="newPromotion.areas"
      :visible="areaDialogVisible"
      :enable-china="false"
      @ok="onChangeAreas"
      @cancel="areaDialogVisible = false">
    </area-selector>
  </div>
</template>

<script>

import { Message } from 'element-ui'
import clone from 'clone'

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
  landingTypeOpts
} from 'constant/fengming'

import {
  checkCreativeContent,
  getRecommendedWords,
  getCurrentBalance,
  getCreativeWords,
  createCampaign,
  clearStore
} from './action'

import store from './store'

const emptyPromotion = {
  mobilePriceRatio: 1,
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
  recommendedWords: [],
  creativeWords: []
}

export default {
  name: 'qwt-create-promotion',
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
      newPromotion: clone(emptyPromotion),
      recommendedWordsVisible: false,
      areaDialogVisible: false,
      timeType: 'long', // long, custom
      queryWord: '',

      landingTypeOpts
    }
  },
  computed: {
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
      const words = this.creativeWords.map(w => w.word)

      return this.recommendedWords.filter(w => !words.includes(w.word))
    }
  },
  methods: {
    async createPromotion() {
      const p = clone(this.newPromotion)

      const pp = this.predictedInfo.dailyBudget
      if (p.dailyBudget < pp) {
        return Message.error(`推广日预算需大于 ${pp} 元`)
      }

      p.dailyBudget = p.dailyBudget * 100

      if (this.timeType === 'custom') {
        if (checkCampaignValidTime(p.validTime) === 'custom') {
          p.validTime = getCampaignValidTime(p.validTime)
        } else {
          return Message.error('请填写投放日期或选择长期投放')
        }
      } else {
        p.validTime = [null, null]
      }

      p.keywords = [
        ...p.recommendedWords,
        ...p.creativeWords
      ]

      p.mobilePriceRatio = parseFloat(p.mobilePriceRatio)
      if (!(p.mobilePriceRatio >= 0.1 && p.mobilePriceRatio <= 10)) {
        return Message.error('请设置合理的移动端出价比例')
      }

      if (!p.landingPage) {
        return Message.error('请填写投放页面')
      }

      if (!p.keywords.length) {
        return Message.error('请填写关键字')
      }

      for (const w of p.keywords) {
        if (w.price * 2 < w.originPrice) {
          return Message.error(`关键字: ${w.word} 出价低于指导价的1/2,请调高出价`)
        }
      }

      if (!p.areas.length) {
        return Message.error('请选择城市')
      }

      if (!p.creativeTitle) {
        return Message.error('请填写创意标题')
      }

      if (p.creativeTitle.length < 9 ||
        p.creativeTitle.length > 25) {
        return Message.error('创意标题需要在9-25个字')
      }

      if (!p.creativeContent) {
        return Message.error('请填写创意内容')
      }

      if (p.creativeContent.length < 9 ||
        p.creativeContent.length > 40) {
        return Message.error('创意内容需要在9-40个字')
      }

      await createCampaign(fmtAreasInQwt(p))

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
        creativeTitle
      } = this.newPromotion

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
    async getCreativeWords() {
      const {
        landingPage
      } = this.newPromotion

      if (landingPage) {
        await getCreativeWords(landingPage)
      }
    },
    switchWordsVisible() {
      this.recommendedWordsVisible = !this.recommendedWordsVisible
    },
    onChangeAreas(areas) {
      this.newPromotion.areas = [...areas]
      this.areaDialogVisible = false
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
    await getCurrentBalance()
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

        & > section:last-child {
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
