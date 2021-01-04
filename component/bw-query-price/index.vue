<template>
  <div class="bg">
    <div class="white-bg">
      <header>标王关键词查价</header>
      <marquee direction="left" scrollamount="6" height="40px" scrolldelay="60"><recent-sold :allAreas="allAreas" /></marquee>
      <main>
        <el-form :model="form" :rules="rules" label-width="120px" ref="form" label-position="left" class="form" @submit.native.prevent>
          <el-form-item label="选择行业" prop="industry">
            <el-tag
              v-for="item in form.industry"
              :key="item"
              class="kw-tag"
              type="success"
              closable
              @close="() => removeIndustry(item)">
              {{ item }}
            </el-tag>
            <i
              v-if="canSelectIndustry"
              class="el-icon-plus"
              @click="visible.selectIndustryDialog = true"
            />
          </el-form-item>
          <el-form-item label="推广关键词" prop="keyword">
            <el-input v-model="form.keyword" style="width: 200px"/>
            <a class="standard" target="_blank" href="//www.baixing.com/help/feed?id=fd53408">查看购买规则</a>
          </el-form-item>
          <el-form-item label="推广平台" prop="devices">
            <el-checkbox-group v-model="form.devices">
              <el-checkbox :label="DEVICE_PC" name="type">电脑</el-checkbox>
              <el-checkbox :label="DEVICE_WAP" name="type">手机</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="推广区域" prop="areas">
            <el-tag type="success" closable class="kw-tag"
                    v-for="area in form.areas" :key="area"
                    @close="removeArea(area)"
            >
              {{ formatArea(area) }}
            </el-tag>
            <i class="el-icon-plus" @click="areaDialogVisible = true"></i>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleQueryPrice" :loading="loading" type="primary">查价</el-button>
          </el-form-item>
        </el-form>

        <hr>

        <div v-if="skus.length" class="results">
          <div>
            <label>查询结果</label>
            <div class="keyword-row" v-if="priceIsNotZero">
              <div v-if="isSold">
                <div v-for="item in exactMatch.deviceTypes" :key="item.device">
                  <p v-if="item.soldCities.length">
                    关键词在<b class="highlight">{{DEVICE[item.device]}}</b>，
                    城市<b class="highlight">{{item.soldCities.map(formatArea).join('，')}}</b>已售出。
                  </p>
                  <result-device v-else :deviceObj="exactMatchNotSoldDevices" :selected="selected" @change="onSelected" />
                </div>
              </div>
              <result-device v-else :deviceObj="exactMatch" :selected="selected" @change="onSelected" />
              <div class="manual-container" v-if="showManualBtn || showLongOrder">
                <el-button
                  type="primary"
                  class="manual-btn"
                  :disabled="loading"
                  @click="manualDialogVisible = true">
                  <span v-if="showManualBtn">人工报价</span>
                  <span v-if="!showManualBtn && showLongOrder">申请长单</span>
                </el-button>
                <p v-if="!showManualBtn && showLongOrder" class="b2b-download">仅限B2B行业申请，<a href="http://wenda.baixing.net/sousuotong-b2b-01.xlsx" download="B2B行业列表.xlsx">查看行业列表</a></p>
                <el-tooltip effect="light" placement="top-start">
                  <manual-tooltip slot="content" />
                  <i class="el-icon-info icon"></i>
                </el-tooltip>
              </div>
            </div>
            <div v-else>该关键词已售出，您可以换个词购买或者在推荐词中选择哦~~</div>
          </div>
          <div class="recommend">
            <label class="recommend-title">推荐词包</label>
            <div class="recommend-content">
              <div class="package-recommend-item" v-for="(groups, i) in packageRecommends" :key="i">
                <result-package-word :id="i" :groups="groups" :selected="selected" @change="onPackageSelected"></result-package-word>
              </div>
            </div>
          </div>
          <section v-if="selected.length">
            <p class="clear" @click="selected = []"><i class="el-icon-close"></i>清除所有选择</p>
            <el-button class="add-to-cart" type="primary" @click="addToCart">加入购物车</el-button>
          </section>
        </div>
      </main>
    </div>

    <selector-dialog
      title="行业选择"
      height="525px"
      :visible.sync="visible.selectIndustryDialog"
      :contents="industryInfoArr"
      :value="form.industry"
      @confirm="selectIndustry"
    />
    <area-selector
      type="bw" :all-areas="allAreas"
      :areas="form.areas"
      :visible="areaDialogVisible"
      :enable-china="false"
      @ok="onAreasChange"
      @cancel="areaDialogVisible = false"
    />
    <manual-dialog
      :visible="manualDialogVisible"
      :all-areas="allAreas"
      :manual-data="manualData"
      @cancel="manualDialogVisible = false"
    />
  </div>
</template>

<script>
import SelectorDialog from 'com/common/selector-dialog'
import AreaSelector from 'com/common/biaowang-area-selector'
import RecentSold from './recent-sold'
import ResultDevice from './result-device'
import ManualTooltip from 'com/common/bw/manual-tooltip'
import ManualDialog from 'com/common/bw/manual-dialog'
import ResultPackageWord from './result-package-word'
import { queryBWIndustry, sendSelectedIndustryToBW, queryKeywordPackagePrice } from 'api/biaowang'
import clone from 'clone'
import {
  DEVICE,
  DEVICE_PC,
  DEVICE_WAP,
  ORDER_APPLY_TYPE_NOT,
  PRICE_NEED_MANUAL_QUOTA,
  THIRTY_DAYS,
  GET_DAYS_MAP
} from 'constant/biaowang'

import {
  f2y,
  getCnName,
  fmtAreasInBw
} from 'util'

export default {
  name: 'bw-package-query-price',
  components: {
    SelectorDialog,
    AreaSelector,
    ResultDevice,
    RecentSold,
    ManualTooltip,
    ManualDialog,
    ResultPackageWord
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
  data () {
    return {
      form: {
        keyword: '',
        devices: [DEVICE_PC, DEVICE_WAP],
        areas: [],
        industry: []
      },
      rules: {
        industry: [{ type: 'array', required: true, trigger: 'change', message: '请填写行业' }],
        keyword: [{ required: true, trigger: 'blur', message: '请填写推广关键词' }],
        devices: [{ type: 'array', required: true, message: '请选择推广平台' }],
        areas: [{ type: 'array', required: true, trigger: 'change', message: '请选择推广区域' }]
      },
      skus: [],
      selected: [],
      packageRecommends: [],
      areaDialogVisible: false,
      manualDialogVisible: false,
      loading: false,
      industryInfo: null,
      visible: {
        selectIndustryDialog: false
      },
      DEVICE,
      DEVICE_PC,
      DEVICE_WAP
    }
  },
  computed: {
    canSelectIndustry () {
      return this.form.industry && this.form.industry.length === 0
    },
    exactMatch () {
      return this.skus.length ? this.skus.slice(0, 1)[0] : null
    },
    recommends () {
      const { skus, exactMatch } = this
      // 推荐词关键词列表不出现精确匹配关键词
      return skus.length > 1 ? skus.slice(1).filter(({ word }) => exactMatch && exactMatch.word !== word) : []
    },
    exactMatchNotSoldDevices () {
      if (!this.exactMatch) return []
      const deviceTypes = this.exactMatch.deviceTypes.filter(o => !o.isSold)
      return {
        ...this.exactMatch,
        deviceTypes
      }
    },
    isSold () {
      if (!this.exactMatch) return false
      return this.exactMatch.deviceTypes.some(list => list.isSold)
    },
    priceIsNotZero () {
      if (!this.exactMatch) return true
      const resultArr = this.exactMatch.deviceTypes.reduce((list, { priceList }) => {
        const arr = priceList.reduce((list, { price }) => {
          return list.concat(price)
        }, [])
        return list.concat(arr)
      }, [])
      return !resultArr.some(price => !price)
    },
    showManualBtn () {
      if (!this.exactMatch) return false
      if (this.isSold) return false
      return this.exactMatch.deviceTypes.some(({ manualPriced, price }) => {
        return !manualPriced && price >= PRICE_NEED_MANUAL_QUOTA
      })
    },
    showLongOrder () {
      if (!this.exactMatch) return false
      if (this.isSold) return false
      return this.exactMatch.deviceTypes.some(({ orderApplyType, price }) => {
        return Number(orderApplyType) === ORDER_APPLY_TYPE_NOT && price < PRICE_NEED_MANUAL_QUOTA
      })
    },
    manualCities () {
      return fmtAreasInBw(this.form.areas, this.allAreas)
    },
    manualDevices () {
      if (!this.exactMatch) return []
      if (this.showManualBtn) {
        return this.exactMatch.deviceTypes.reduce((list, { manualPriced, price, device }) => {
          if (!manualPriced && price >= PRICE_NEED_MANUAL_QUOTA) list.push(device)
          return list
        }, [])
      }
      if (this.showLongOrder) {
        return this.exactMatch.deviceTypes.reduce((list, { orderApplyType, price, device }) => {
          if (Number(orderApplyType) === ORDER_APPLY_TYPE_NOT && price < PRICE_NEED_MANUAL_QUOTA) list.push(device)
          return list
        }, [])
      }
      return []
    },
    manualData () {
      return Object.assign({}, {
        manualCities: this.manualCities,
        word: this.form.keyword,
        cities: this.form.areas,
        targetUserId: this.getFinalUserId(),
        devices: this.manualDevices.length ? this.manualDevices : this.form.devices
      })
    },
    industryInfoArr () {
      return this.industryInfo
        ? this.industryInfo.reduce((h, c) => {
            h.push([[c.title], [...c.content]])
            return h
          }, [])
        : []
    }
  },
  async created () {
    this.industryInfo = await queryBWIndustry()
  },
  mounted () {
    let { cities = '', device, word } = this.$route.query
    device = Number(device)

    Object.assign(this.form, {
      areas: cities.split('|').filter(o => o.trim() !== ''),
      keyword: word,
      devices: (device && [DEVICE_PC, DEVICE_WAP].includes(device)) ? [].concat(device) : this.form.devices
    })
  },
  methods: {
    f2y,
    getFinalUserId () {
      const { user_id: userId } = this.$route.query
      if (userId) {
        return userId
      }
      const { userInfo } = this
      return userInfo.id
    },
    onSelected (item) {
      if (this.selected.includes(item)) {
        return this.selected.splice(this.selected.indexOf(item), 1)
      }

      const inCart = this.selected
        .find(i => i.word === item.word && i.device === item.device && i.days !== item.days)

      if (inCart) {
        this.selected.splice(this.selected.indexOf(inCart), 1)
      }
      this.selected.push(item)
    },
    onPackageSelected (groupSelected) {
      const addList = []
      groupSelected.forEach(group => {
        const inCart = this.selected
          .some(i => i.word === group.word && i.device === group.device)
        if (!inCart) { addList.push(group) }
      })
      if (addList.length) {
        this.selected.push(...addList)
      }
    },
    onAreasChange (areas) {
      this.form.areas = [...areas]
      this.areaDialogVisible = false
    },
    formatArea (name) {
      return getCnName(name, this.allAreas)
    },
    removeArea (area) {
      this.form.areas = [
        ...this.form.areas.filter(i => i !== area)
      ]
      this.$bus.$emit('updateBiaowangAreaSelectorView', area)
    },
    removeIndustry (val) {
      this.form.industry.splice(
        this.form.industry.findIndex(x => x === val), 1
      )
    },
    selectIndustry (val) {
      this.form.industry = val || []
    },
    handleQueryPrice () {
      this.$refs.form.validate(async isValid => {
        if (isValid) {
          this.queryPrice()
          this.sendIndustryInfo()
        }
      })
    },
    // 查价时需把数据打给数据组
    sendIndustryInfo () {
      sendSelectedIndustryToBW({
        secondIndustryNameCn: this.form.industry[0],
        keyword: this.form.keyword
      })
    },
    async queryPrice () {
      this.selected = []
      this.loading = true
      const { keyword, devices, areas } = this.form
      try {
        const results = await queryKeywordPackagePrice({
          targetUserId: this.getFinalUserId(),
          word: keyword.trim().replace(/[\u200b-\u200d\uFEFF]/g, ''), // 去除空格和零宽字符
          device: devices.length === 2 ? 0 : devices[0],
          cities: areas
        })
        const { recommendList, cities } = results
        const mergeWordList = [results.keyword, ...recommendList]

        this.skus = mergeWordList.map(w => {
          const deviceTypes = w.priceList.map(d => {
            const soldPriceMap = GET_DAYS_MAP(d.orderApplyType).reduce((curr, prev) => {
              return Object.assign(curr, {
                [prev]: prev / THIRTY_DAYS * d.price
              })
            }, {})
            const priceList = Object.entries(soldPriceMap).map(entry => {
              return {
                device: d.device,
                word: w.word,
                cities,
                soldPriceMap: soldPriceMap,
                days: entry[0],
                price: entry[1],
                wordType: results.keyword.word === w.word ? 1 : 2
              }
            })
            return {
              ...d,
              priceList
            }
          })
          return {
            word: w.word,
            cities,
            deviceTypes
          }
        })
        const cloneSkus = clone(this.skus)
        cloneSkus.shift()
        this.packageRecommends = this.groupPackageRecommends(cloneSkus)
      } finally {
        this.loading = false
      }
    },
    addToCart () {
      this.$parent.$refs.bwShoppingCart.addToCart(this.selected)
      this.selected = []
    },
    groupPackageRecommends (recommends) {
      let group = []
      const packageRecommends = []
      for (let i = 0; i < recommends.length; i++) {
        group.push(recommends[i])
        if (group.length === 3) {
          packageRecommends.push([...group])
          group = []
        }
      }
      return packageRecommends
    }
  },
  watch: {
    'userInfo.shAgent': {
      immediate: true,
      handler (val) {
        if (val) {
          this.$router.push('/main')
        }
      }
    },
    form: {
      deep: true,
      handler () {
        this.skus = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  color: #666;
  border-bottom: 1px solid #e6e6e6;
  padding: 15px;
  font-size: 16px;
}
div.bg {
  & > .white-bg {
    background-color: #fff;

    & > main {
      box-shadow: 0px 2px 9px 0px rgba(83, 95, 127, 0.1);
      min-height: 700px;
      padding: 45px 60px;
    }
  }
}
.kw-tag {
  margin-right: 10px;
}
.clear {
  color: $qwt-c-orange;
  margin: 10px 0;
  cursor: pointer;
  margin-left: 120px;
  margin-bottom: 20px;
}
.add-to-cart {
  margin-left: 120px;
}
.form {
  margin-bottom: 40px;
}
.result-row {
  margin-bottom: 10px;
}
.highlight {
  color: red;
  margin: 0 5px;
}
.notice {
  font-size: 13px;
  margin-bottom: 20px;
  & > p {
    margin-bottom: 5px;

    & > span {
      width: 145px;
    }

    & /deep/ .red {
      background-color: #ff3c3c;
      color: white;
      padding: 1px 4px;
      margin: 0 5px;
      border-radius: 2px;
    }
  }
}
.results {
  & > div {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;

    & > label {
      width: 120px;
      vertical-align: middle;
      float: left;
      font-size: 14px;
      color: #606266;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
  }
}
marquee {
  background-color: #fff7eb;
  color: #c6a674;
  display: flex;
  align-items: center;
}
.el-icon-plus {
  cursor: pointer;
  font-size: 1.2em;
  padding: 10px;

  &:hover {
    font-weight: bold;
  }
}
.recommend {
  display: flex;
  align-items: flex-start;
  & .recommend-content {
    flex: 1;
    & .package-recommend-item {
      margin-bottom: 20px;
      border-bottom: 2px dashed #dcdfe6;
      padding: 15px;
    }
  }
}
.keyword-row {
  display: flex;
  align-items: center;
  & .manual-container {
    position: relative;
    margin-left: 16px;
    display: flex;
    align-items: center;
  }
  & .el-icon-info {
    color: #6a778c;
    cursor: pointer;
  }
}
.b2b-download,
.b2b-download > a,
.standard {
  font-size: 12px;
  color: #ff6350;
  & > a {
    text-decoration: underline;
  }
}
.b2b-download {
  width: 180px;
  position: absolute;
  top: 50px;
}
</style>
