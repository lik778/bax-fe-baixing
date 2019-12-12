<template>
  <div class="create-promotion-cibao">
    
    <section class="promotion-target">
      <header>选择推广站点</header>
      <qiqiaoban-page-selector :product-type="PRO_SITE_PRODUCT_TYPE"
                               :value="promotion.landingPage"
                               :disabled="true" />
    </section>

    <section>
      <header>输入服务内容/产品关键词</header>
      <div class="info">
        <p>说明:</p>
        <p>核心词为城市+服务内容/产品的组合模式，城市为单选，如需添加多个城市的请分开多次提交核心词</p>
        <p>核心词仅作为首页宝加速词包拓词使用，并不代表核心词会作为推广词展示在流量平台首页</p>
        <p>同一个计划中核心词可增加，暂不支持修改、删除核心词，核心词上限1000个</p>
        <p>可批量添加关键词：请用逗号区分关键词进行批量关键词添加，如合肥家政服务公司，合肥月嫂，合肥钟点工</p>
        <p>关键词字数限制为2-99个字</p>
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
          <div class="keyword-pane-tags">
            <template v-if="originPromotion && Array.isArray(originPromotion.keywords)">
              <el-tag v-for="item in originPromotion.keywords"
                      :key="item"
                      class="keyword-pane-tag"
                      type="primary">{{item}}
              </el-tag>
            </template>
            <template v-if="promotion.keywords && promotion.keywords.length > 0">
              <el-tag type="primary"
                      class="keyword-pane-tag"
                      closable
                      @close="handleTagClose"
                      v-for="item in promotion.keywords"
                      :key="item">{{item}}
              </el-tag>
            </template>
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

      <contract-ack type="content-rule" ref="contract" />
      <el-button class="submit"
                 type="primary"
                 @click="onCreateClick">更新推广</el-button>
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
import { chargeList } from 'constant/seo'
import { updateCibaoPromotion, getCibaoPromotionByCampaignId } from 'api/seo'
import { PRO_SITE_PRODUCT_TYPE } from 'constant/site'
import { getCnName } from 'util'

import AreaSelector from 'com/common/area-selector'
import ContractAck from 'com/widget/contract-ack'
import QiqiaobanPageSelector from 'com/common/qiqiaoban-page-selector'
import clone from 'clone'

export default {
  name:'seo-create-promotion-cibao',
  components: {
    AreaSelector,
    ContractAck,
    QiqiaobanPageSelector
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
      areaDialogVisible:false,
      search: '',
      city: '',
      originPromotion: null,

      promotion: {
        landingPage: '', 
        keywords: [], // 新增词
        duration: 0,
        volume: 1000,
        id:'',
      }
    }
  },
  async mounted () {
    this.promotion.id = this.$route.params.id
    await this.getPromotionData()
  },
  computed: {
    charge() {
      const { duration, volume } = this.promotion
      const chargeObj = chargeList.find(o => o.volume === volume && o.duration === duration)
      return chargeObj ? chargeObj.charge : chargeList[0].charge
    }
  },
  methods: {
    async getPromotionData() {
      const initData = await getCibaoPromotionByCampaignId(this.$route.params.id)
      this.originPromotion = clone(initData)
      for (let key in initData) {
        if (key in this.promotion && key !== 'keywords') {
          this.promotion[key] = initData[key]
        }
      }
    },
    handleCityClose() {
      this.city = ''
    },
    handleTagClose(tag, index) {
      this.promotion.keywords.splice(index, 1)
    },
    addKeyword() {
      if (!this.city) {
       return this.$message.error('请先选择投放城市')
      }
      let words = this.search.trim().split(/[，,]]*/g)
      words = Array.from(new Set(words.map( row=> {
        return row.trim()
      }).filter(row => row !== '')))

      const originKeywordsLen = this.originPromotion.keywords

      for (let i = 0; i< words.length ; i++) {
        let w = words[i]
        if (w.length < 2 || w.length > 99) {
          this.$message.error('已过滤字数不满足2-99个的关键词')
          words.splice(i, 1)
          continue
        }
        const newWord = `${this.city}${w}`
        if (this.promotion.keywords.includes(newWord)) {
          this.$message.warning(`${newWord}该关键词已存在`)
          words.splice(i, 1)
          continue
        } 

        if (this.promotion.keywords.length >= (1000 - originKeywordsLen)) {
         this.$message.error('核心词上限为1000个')
         return this.search = ''
        }
        if (!this.promotion.keywords.includes(newWord) && !this.originPromotion.keywords.includes(newWord)) {
          this.promotion.keywords.push(newWord)
        }
      }
     this.search = ''
    },
    onChangeAreas(val) { 
      this.areaDialogVisible = false
      if (val.length > 1) {
        return this.$message.error('城市只能单选')
      }
      this.city = getCnName(val[0], this.allAreas)
    },
    onCreateClick() {
      if (!this.$refs.contract.$data.isAgreement) {
        return this.$message.error('请阅读并勾选同意服务协议，再进行下一步操作')
      }
      if (!this.promotion.keywords.length) {
        return this.$message.error('请新增关键词')
      }
      const options = clone(this.promotion)
      options.keywords = this.originPromotion.keywords.concat(options.keywords)
      updateCibaoPromotion(options).then(res=>{
        if (res.message === 'success') {
          this.$message.success('更新成功')
          this.$router.push({name: 'seo-promotion-list'})
        } else {
          this.$message.error(res.message)
        }
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
        & .keyword-pane-tags {
          max-width: 80%;
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