<template>
  <div class="bg">
    <div class="white-bg">
      <header>标王关键词查价</header>
      <marquee direction="left" scrollamount="6" height="40px" scrolldelay="60"><recent-sold :allAreas="allAreas" /></marquee>
      <main>
        <div class="notice">
          <p><span><i class="red">满</i>500-4999元，</span><i class="red">加</i>1200元即可获得1年+半年价值2700元的专业版官网；</p>
          <p><span><i class="red">满</i>5000-9999元，</span><i class="red">加</i>900元即可获得1年+半年价值2700元的专业版官网；</p>
          <p><span><i class="red">满</i>10000元及以上，</span><i class="red">加</i>300元即可获得1年+半年价值2700元的专业版官网；</p>
        </div>
        <el-form :model="form" :rules="rules" label-width="120px" ref="form" label-position="left" class="form" @submit.native.prevent>
          <el-form-item label="推广关键词" prop="keyword">
            <el-input v-model="form.keyword" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="推广平台" prop="devices">
            <el-checkbox-group v-model="form.devices">
              <el-checkbox :label="1" name="type">电脑</el-checkbox>
              <el-checkbox :label="2" name="type">手机</el-checkbox>
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
            <div v-if="priceIsNotZero">
              <p v-if="isSold">关键词在城市
                <span class="highlight">{{soldCities.map(formatArea).join(', ')}}</span>已售出。
                  <span v-if="availableCities.length">
                  投放在剩余城市价格：
                  <span v-for="deviceI in exactMatch.deviceTypes" :key="deviceI.device">
                    <span v-for="(item, index) in deviceI.priceList" :key="index">
                      {{item.days}}天 {{DEVICE[item.device]}}共{{f2y(item.price)}}元
                      {{index !== deviceI.priceList.length - 1 ? '、': ''}}
                    </span>；
                  </span>
                </span>
              </p>
              <result-device v-else :deviceObj="exactMatch" :selected="selected" @change="onSelected" />
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
  </div>
</template>

<script>
  import AreaSelector from 'com/common/area-selector'
  import RecentSold from './recent-sold'
  import ResultDevice from './result-device'

  import {queryKeywordPriceNew} from 'api/biaowang'
  import clone from 'clone'
  import {DEVICE} from 'constant/biaowang'
  import { allowNotSeeBwNewPrice } from 'util/role'

  import {
    f2y,
    fmtAreasInQwt,
    getCnName
  } from 'util'

  export default {
    name: 'bw-query-price',
    components: {
      AreaSelector,
      ResultDevice,
      RecentSold
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
          devices: [1, 2],
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
        loading: false,
        DEVICE,
      }
    },
    computed: {
      allowNotSeeBwNewPrice() {
        // 外部代理商无法看到标王新建页面
        return allowNotSeeBwNewPrice(this.userInfo.roles, this.userInfo.agentId)
      },
      exactMatch() {
        return this.skus.slice(0, 1)[0]
      },
      recommends() {
        const { skus, exactMatch } = this
        // 推荐词关键词列表不出现精确匹配关键词
        return skus.slice(1).filter(({word}) => exactMatch && exactMatch.word !== word)
      },
      soldCities() {
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
        return this.exactMatch.deviceTypes.some(list => list.isSold)
      },
      availableCities() {
        return this.exactMatch.cities.filter(c => !this.soldCities.includes(c))
      },
      priceIsNotZero() {
        const resultArr = this.exactMatch.deviceTypes.reduce((list, {priceList}) => {
          const arr = priceList.reduce((list, {price}) => {
            return list.concat(price)
          }, [])
          return list.concat(arr)
        }, [])
        return !resultArr.some(price => !price)
      }
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
                word: keyword.trim(),
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
      allowNotSeeBwNewPrice: {
        immediate: true,
        handler(val) {
          if (val) {
            history.go(-1)
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
  font-size: 12px;
  background-color: #f5f5f5;
  padding: 20px;
  margin-top: 10px;
  margin-bottom: 20px;
  & >>> .gold {
    font-weight: 300;
    color: gold;
    padding: 0 2px;
  }
  & > p {
    margin-bottom: 5px;

    /* & > span {
      width: 145px;
    } */

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
</style>
