<template>
  <div class="create-promotion-cibao">
    <section>
      <div class="section-inline">
        <header>选择投放时长</header>
        <el-radio-group v-model="promotion.duration"
                        size="medium">
          <el-radio-button :label="item"
                           v-for="item in durations"
                           :key="item">{{item}}天</el-radio-button>
        </el-radio-group>
      </div>
      <div class="section-inline">
        <header>选择首页关键词数量</header>
        <el-radio-group v-model="promotion.volume"
                        size="medium">
          <el-radio-button v-for="item in volumes"
                           :label="item"
                           :key="item">{{item}}词</el-radio-button>
        </el-radio-group>
      </div>
    </section>

    <section class="promotion-target">
      <header>选择推广站点</header>

      <qiqiaoban-page-selector :product-type="PRO_SITE_PRODUCT_TYPE"
                               :value="promotion.landingPage"
                               @change-obj="v => onLandingChange(v)" />
      <p class="warning"
         v-if="showExpireWarning">站点{{promotion.duration === NINETY_DAYS?'3':'6'}}个月内将过期，
         请选择其他站点，或<router-link :to="{name: 'seo-charge'}">购买</router-link>新官网
      </p>
      <p class="warning"
         v-if="showExistWebsite">该站点已创建首页宝加速词包计划，请更换</p>
    </section>

    <section>
      <header>输入服务内容/产品关键词</header>
      <div class="info">
        <p>说明:</p>
        <p>核心词为城市+服务内容/产品的组合模式，城市为单选，如需添加多个城市的请分开多次提交核心词</p>
        <p>核心词仅作为首页宝加速词包拓词使用，并不代表核心词会作为推广词展示在流量平台首页</p>
        <p>同一个计划中核心词可增加，暂不支持修改、删除核心词</p>
        <p>可批量添加关键词：请用逗号区分关键词进行批量关键词添加，如合肥家政服务公司，合肥月嫂，合肥钟点工</p>
      </div>
      <div class="keyword">
        <div class="keyword-pane">
          <div class="keyword-pane-title">增加核心词</div>
          <div class="keyword-pane-cont">
            <div>
              <label>投放城市：</label>
              <i class="el-icon-plus"
                 @click="areaDialogVisible = true"></i>
              <el-tag type="danger"
                      v-if="city"
                      closable
                      @close="handleCityClose">{{city}}</el-tag>
            </div>
            <div>
              <el-input class="keyword-input"
                        size="small"
                        v-model="search"
                        placeholder="请输入服务内容或产品关键词"></el-input>
              <el-button type="primary"
                         size="small"
                         @click="addKeyword">批量添加</el-button>
            </div>
          </div>
        </div>
        <div class="keyword-pane"
             style="margin-top: 20px">
          <div class="keyword-pane-title">已选核心词</div>
          <div class="keyword-pane-tags"
               v-if="promotion.keywords && promotion.keywords.length > 0">
            <el-tag type="primary"
                    class="keyword-pane-tag"
                    closable
                    @close="handleTagClose(item,index)"
                    v-for="(item,index) in promotion.keywords"
                    :key="index">{{item}}
            </el-tag>
          </div>
        </div>
      </div>
    </section>

    <section>
      <header>推广确认</header>
      <div>
        <p>推广渠道：百度</p>
        <p>推广平台：电脑端、移动端双端推广</p>
        <p>预扣款：{{charge}}元（原价{{charge * 2}}元），可推广{{promotion.duration}}天，首页关键词数量{{promotion.volume}}词</p>
      </div>

      <contract-ack type="content-rule" />
      <el-button class="submit"
                 type="primary"
                 @click="onCreateClick">创建推广</el-button>
    </section>

    <area-selector type="seo"
                   :all-areas="allAreas"
                   :areas="[]"
                   :visible="areaDialogVisible"
                   :enable-china="false"
                   @ok="onChangeAreas"
                   @cancel="areaDialogVisible = false" />
  </div>
</template>

<script>
import { createCibaoPromotion, getBusinessLicense, getPromotedWebsite, getBalance } from 'api/seo'
import { KEYWORD_TYPE_USER, durations, volumes, NINETY_DAYS, ONE_THROUND_KEYWORD, chargeList} from 'constant/seo'
import { PRO_SITE_PRODUCT_TYPE } from 'constant/site'
import dayjs from 'dayjs'
import { getCnName } from 'util'

import AreaSelector from 'com/common/area-selector'
import QiqiaobanPageSelector from 'com/common/qiqiaoban-page-selector'
import ContractAck from 'com/widget/contract-ack'

export default {
  name:'seo-create-promotion-cibao',
  components: {
    QiqiaobanPageSelector,
    AreaSelector,
    ContractAck
  },
  props: {
    allAreas: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      PRO_SITE_PRODUCT_TYPE,
      NINETY_DAYS,
      showExpireWarning: false,
      showExistWebsite: '',
      loading: false,
      areaDialogVisible:false,
      search: '',
      city: '',
      volumes,
      durations,
      existPromotionWebsite: [], //已有计划官网列表
      balance: '',

      promotion: {
        landingPage: '',
        keywords: [],
        duration: 0,
        volume: 1000
      }
    }
  },
  async created () {
    this.promotion.duration = this.durations[0]
    this.promotion.volume = this.volumes[0]

    await this.loadBalance()
    await this.getPromotedWebsite()
  },
  computed: {
    charge() {
      const { duration, volume } = this.promotion
      const chargeObj = chargeList.find(o => o.volume === volume && o.duration === duration)
      return chargeObj ? chargeObj.charge : chargeList[0].charge
    }
  },
  methods: {
    async loadBalance() {
      const d = await getBalance()
      this.balance = d.balance
    },
    async getPromotedWebsite() {
      this.existPromotionWebsite = await getPromotedWebsite()
    },
    onLandingChange(v) {
      const landingPage = 'http://' + v.domain + '.mvp.baixing.com'
      this.promotion.landingPage = landingPage
      this.showExpireWarning = dayjs(v.expireAt).subtract(3, 'month').isBefore(dayjs(), 'day')
      this.showExistWebsite = this.existPromotionWebsite.some(o => (o.trim() === landingPage))
    },
    handleCityClose() {
      this.city = ''
    },
    handleTagClose(tag, index) {
      this.promotion.keywords.splice(index, 1)
    },
    addKeyword() {
      if (!this.city) {
        this.$message.error('请先选择投放城市')
      }
      let words = this.search.trim().split(/[，,]]*/g)
      words = Array.from(new Set(words.map( row=> {
        return row.trim()
      }).filter(row => row !== '')))
     
      for (let i = 0; i< words.length ; i++) {
        let w = words[i]
        if (w.length < 2 || w.length > 99) {
          return this.$message.error('关键词字数限制2-99个')
        }
        const newWord = `${this.city}${w}`
        if (this.promotion.keywords.length > 1000) {
         return this.$message.error('每次最多支持上传1000个关键词')
        }
        if (!this.promotion.keywords.includes(newWord)) {
          this.promotion.keywords.push(newWord)
        }
     }
    },
    onChangeAreas(val) { 
      this.areaDialogVisible = false
      if (val.length > 1) {
        return this.$message.error('城市只能单选')
      }
      this.city = getCnName(val[0], this.allAreas)
    },
    onCreateClick() {
      if (!this.promotion.landingPage) {
        return this.$message.error('请选择落地页')
      }
      if (this.showExpireWarning) {
        return this.$message.error('不可选择3个月内过期的落地页')
      }
      if (this.showExistWebsite) {
        return this.$message.error('不可选择已创建首页宝加速词包计划的官网')
      }
      if (!this.promotion.keywords.length) {
        return this.$message.error('请选取关键词')
      }

      createCibaoPromotion({...this.promotion}).then(res=>{
        this.$message.success('创建成功')
        this.$router.push({name: 'seo-promotion-list'})
      })
    }
  },
}
</script>

<style lang="postcss" scoped>
.create-promotion-cibao {
  color: #6a778c;
  font-size: 14px;
  border-radius: 4px;

  & > section {
    padding: 20px;
    background-color: #fff;
    & > .section-inline {
      display: flex;
      align-items: center;
      & > header {
        font-weight: bold;
        width: 160px;
      }
    }

    & > header {
      font-weight: bold;
      margin-bottom: 20px;
    }

    & > .info {
      font-size: 13px;
    }

    & > div:not(:last-of-type) {
      margin-bottom: 20px;
    }

    & .kw-tag {
      margin-right: 5px;
    }

    & .keyword {
      margin-left: 40px;
      & .keyword-pane {
        display: flex;
        & .keyword-pane-title {
          font-weight: 600;
          width: 120px;
        }
        & .keyword-pane-cont {
          flex: 1;
          & .el-icon-plus {
            cursor: pointer;
          }
          & .red {
            color: #ff6350;
          }
        }
        & .keyword-input {
          margin-top: 10px;
          width: 400px;
        }
        & .keyword-pane-tag {
          margin-bottom: 10px;
          margin-right: 6px;
        }
      }
    }
  }
}
.warning {
  color: #ff6350;
  margin-top: 6px;
  font-size: 14px;
}
.submit {
  margin-top: 20px;
}
</style>