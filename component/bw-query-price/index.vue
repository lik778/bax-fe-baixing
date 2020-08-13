<template>
  <div class="bg">
    <div class="white-bg">
      <header>标王关键词查价</header>
      <marquee direction="left" scrollamount="6" height="40px" scrolldelay="60"><recent-sold :allAreas="allAreas" /></marquee>
      <main>
        <div class="notice">
          <p><span><i class="red">满</i>500-4999元，</span>购买精品官网1年立<i class="red">减</i>200元；购买精品官网2年（送一年）官网<i class="red">减</i>600元；购买精品官网专业版1年（支持首页宝推广）官网<i class="red">减</i>600元；</p>
          <p><span><i class="red">满</i>5000-9999元，</span>购买精品官网1年立<i class="red">减</i>600元；购买精品官网2年（送一年）官网<i class="red">减</i>1200元；购买精品官网专业版1年（支持首页宝推广）官网<i class="red">减</i>900元；</p>
          <p><span><i class="red">满</i>10000元及以上，</span>购买精品官网1年立<i class="red">减</i>1000元；购买精品官网2年（送一年）官网<i class="red">减</i>1400元；购买精品官网专业版1年（支持首页宝推广）官网<i class="red">减</i>1500元；</p>
        </div>
        <el-form :model="form" :rules="rules" label-width="120px" ref="form" label-position="left" class="form" @submit.native.prevent>
          <el-form-item label="推广关键词" prop="keyword">
            <el-input v-model="form.keyword" style="width: 200px"/>
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
            <el-button @click="queryPrice" :loading="loading" type="primary">查价</el-button>
          </el-form-item>
        </el-form>

        <hr>

        <div v-if="skus.length" class="results">
          <div>
            <label>查询结果</label>
            <div class="keyword-row" v-if="priceIsNotZero">
              <p v-if="isSold">关键词在城市
                <span class="highlight">{{soldCities.map(formatArea).join(', ')}}</span>已售出。
                  <!-- <span v-if="availableCities.length">
                  投放在剩余城市价格：
                  <span v-for="deviceI in exactMatch.deviceTypes" :key="deviceI.device">
                    <span v-for="(item, index) in deviceI.priceList" :key="index">
                      {{item.days}}天 {{DEVICE[item.device]}}共{{f2y(item.price)}}元
                      {{index !== deviceI.priceList.length - 1 ? '、': ''}}
                    </span>；
                  </span>
                </span> -->
              </p>
              <result-device v-else :deviceObj="exactMatch" :selected="selected" @change="onSelected" />
              <div class="manual-container" v-if="showManualBtn || showLongOrder">
                 <el-button type="primary" class="manual-btn"
                            :disabled="loading"
                            @click="manualDialogVisible = true">
                  <span v-if="showManualBtn">人工报价</span>
                  <span v-if="!showManualBtn && showLongOrder">申请年单</span>
                 </el-button>
                 <el-tooltip effect="light" placement="top-start">
                   <manual-tooltip slot="content" />
                   <i class="el-icon-info icon"></i>
                 </el-tooltip>
              </div>
            </div>
            <div v-else>该关键词已售出，您可以换个词购买或者在推荐词中选择哦~~</div>
          </div>
          <div v-if="recommends.length" class="recommend">
            <label class="recommend-title">推荐近似关键词</label>
            <div class="recommend-content">
              <div class="recommend-item" v-for="item in recommends" :key="item.word">
                <result-device :deviceObj="item" :selected="selected" @change="onSelected" />
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

    <area-selector type="bw" :all-areas="allAreas"
      :areas="form.areas"
      :visible="areaDialogVisible"
      :enable-china="false"
      @ok="onAreasChange"
      @cancel="areaDialogVisible = false"
    />
    <manual-dialog :visible="manualDialogVisible"
                   @cancel="manualDialogVisible = false"
                   :all-areas="allAreas"
                   :manual-data="manualData" />
  </div>
</template>

<script>
  import AreaSelector from 'com/common/area-selector'
  import RecentSold from './recent-sold'
  import ResultDevice from './result-device'
  import ManualTooltip from 'com/common/bw/manual-tooltip'
  import ManualDialog from 'com/common/bw/manual-dialog'

  import {queryKeywordPriceNew} from 'api/biaowang'
  import clone from 'clone'
  import pick from 'lodash.pick'
  import {DEVICE, DEVICE_ALL, DEVICE_PC, DEVICE_WAP, ORDER_APPLY_TYPE_NOT, PRICE_NEED_MANUAL_QUOTA} from 'constant/biaowang'

  import {
    f2y,
    getCnName,
    fmtAreasInBw
  } from 'util'

  export default {
    name: 'bw-query-price',
    components: {
      AreaSelector,
      ResultDevice,
      RecentSold,
      ManualTooltip,
      ManualDialog
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
        form: {
          keyword: '',
          devices: [DEVICE_PC, DEVICE_WAP],
          areas: []
        },
        rules: {
          keyword: [{required: true, message: '请填写推广关键词'}],
          devices: [{type: 'array', required: true, message: '请选择推广平台'}],
          areas: [{type: 'array', required: true, trigger: 'change', message: '请选择推广区域'}]
        },
        skus: [],
        selected: [],

        areaDialogVisible: false,
        manualDialogVisible: false,
        loading: false,
        DEVICE,
        DEVICE_PC,
        DEVICE_WAP
      }
    },
    computed: {
      exactMatch() {
        return this.skus.length ? this.skus.slice(0, 1)[0] : null
      },
      recommends() {
        const { skus, exactMatch } = this
        // 推荐词关键词列表不出现精确匹配关键词
        return skus.length > 1 ? skus.slice(1).filter(({word}) => exactMatch && exactMatch.word !== word) : []
      },
      soldCities() {
        if (!this.exactMatch) return []
        const soldCities = []
        this.exactMatch.deviceTypes
          .reduce((list, {soldCities}) => {
            return list.concat(Array.isArray(soldCities) ? soldCities : [])
          }, [])
          .forEach(city => {
            if (!soldCities.includes(city)) {
              soldCities.push(city)
            }
          })
        return soldCities
      },
      isSold() {
        if (!this.exactMatch) return false
        return this.exactMatch.deviceTypes.some(list => list.isSold)
      },
      availableCities() {
        if (!this.exactMatch) return []
        return this.exactMatch.cities.filter(c => !this.soldCities.includes(c))
      },
      priceIsNotZero() {
        if(!this.exactMatch) return true
        const resultArr = this.exactMatch.deviceTypes.reduce((list, {priceList}) => {
          const arr = priceList.reduce((list, {price}) => {
            return list.concat(price)
          }, [])
          return list.concat(arr)
        }, [])
        return !resultArr.some(price => !price)
      },
      showManualBtn() {
        if (!this.exactMatch) return false
        if (this.isSold) return false
        return this.exactMatch.deviceTypes.some(({manualPriced, price}) => {
          return !manualPriced && price >= PRICE_NEED_MANUAL_QUOTA
        })
      },
      showLongOrder() {
        if (!this.exactMatch) return false
        if (this.isSold) return false
        return this.exactMatch.deviceTypes.some(({orderApplyType, price}) => {
          return Number(orderApplyType) === ORDER_APPLY_TYPE_NOT && price < PRICE_NEED_MANUAL_QUOTA
        })
      },
      manualCities() {
        return fmtAreasInBw(this.form.areas, this.allAreas)
      },
      manualDevices() {
        if (!this.exactMatch) return []
        if (this.showManualBtn) {
          return this.exactMatch.deviceTypes.reduce((list, {manualPriced, price, device}) => {
            if (!manualPriced && price >= PRICE_NEED_MANUAL_QUOTA) list.push(device)
            return list
          }, [])
        }
        if (this.showLongOrder) {
          return this.exactMatch.deviceTypes.reduce((list, {orderApplyType, price,device}) => {
            if (Number(orderApplyType) === ORDER_APPLY_TYPE_NOT && price < PRICE_NEED_MANUAL_QUOTA) list.push(device)
            return list
          }, [])
        }
        return []
      },
      manualData() {
        return Object.assign({}, {
          manualCities: this.manualCities,
          word: this.form.keyword,
          cities: this.form.areas,
          targetUserId: this.getFinalUserId(),
          devices: this.manualDevices.length ? this.manualDevices : this.form.devices,
        })
      }
    },
    mounted() {
      let { cities, device, word } = this.$route.query
      device = Number(device)

      Object.assign(this.form, {
        areas: cities.split('|').filter(o => o.trim() !== ''),
        keyword: word,
        devices: (device && [DEVICE_PC, DEVICE_WAP].includes(device)) ? [].concat(device): this.form.devices
      })
    },
    methods: {
      f2y,
      getFinalUserId() {
        const { user_id: userId } = this.$route.query
        if (userId) {
          return userId
        }
        const { userInfo } = this
        return userInfo.id
      },
      onSelected(item) {
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
      onAreasChange(areas) {
        this.form.areas = [...areas]
        this.areaDialogVisible = false
      },
      formatArea(name) {
        return getCnName(name, this.allAreas)
      },
      removeArea(area) {
        this.form.areas = [
          ...this.form.areas.filter(i => i !== area)
        ]
      },
      queryPrice() {
        this.$refs.form.validate(async isValid => {
          if (isValid) {
            this.selected = []
            this.loading = true
            const {keyword, devices, areas} = this.form
            try {
              const results = await queryKeywordPriceNew({
                targetUserId: this.getFinalUserId(),
                word: keyword.trim().replace(/[\u200b-\u200d\uFEFF]/g, ''), //去除空格和零宽字符
                device: devices.length === 2 ? 0 : devices[0],
                cities: areas
              })
              this.skus = results.map(w => {
                const deviceTypes = w.priceList.map(d => {
                  const priceList = Object.entries(d.priceMap).map(entry => {
                    return {
                      device: d.device,
                      word: w.word,
                      cities: w.cities,
                      soldPriceMap: d.priceMap,
                      days: entry[0],
                      price: entry[1]
                    }
                  })
                  return {
                    ...d,
                    priceList
                  }
                })
                return {
                  word: w.word,
                  cities: w.cities,
                  deviceTypes
                }
              })
            } finally {
              this.loading = false
            }
          } else {
            return false
          }
        })
      },
      addToCart() {
        this.$parent.$refs.bwShoppingCart.addToCart(this.selected)
        this.selected = []
      }
    },
    watch: {
      'userInfo.shAgent': {
        immediate: true,
        handler(val) {
          if (val) {
            this.$router.push('/main')
          }
        }
      }
    }
  }
</script>

<style lang="postcss" scoped>
@import '../../cssbase/var';

header {
  color: #666;
  border-bottom: 1px solid #E6E6E6;
  padding: 15px;
  font-size: 16px;
}
div.bg {

  & > .white-bg {
    background-color: #fff;

    & > main {
      box-shadow: 0px 2px 9px 0px rgba(83, 95, 127, .1);
      min-height: 700px;
      padding: 45px 60px;
    }
  }
}
.kw-tag {
  margin-right: 10px;
}
.clear {
  color: var(--qwt-c-orange);
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

    & >>> .red {
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
  background-color: #FFF7EB;
  color: #C6A674;
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
    & .recommend-item {
      margin-bottom: 10px;
    }
  }
}
.keyword-row {
  display: flex;
  align-items: center;
  & .manual-btn {
    margin-left: 20px;
  }
  & .el-icon-info {
    color:#6a778c;
    cursor: pointer;
  }
}
</style>
