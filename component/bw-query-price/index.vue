<template>
  <div class="bg">
    <div class="white-bg">
      <header>标王关键词查价</header>
      <marquee direction="left" scrollamount="6" height="40px" scrolldelay="60"><recent-sold :allAreas="allAreas" /></marquee>
      <main>
        <div class="notice">
          <p v-for="(item, index) in discountInfo" :key="index">
            <strong class="name">{{item[0]}}</strong>：
            <span v-html="item[1].replace(/&%(.*?)&%/g, `<strong class='gold'>$1</strong>`)"></span>，
            同时购买专业版精品官网1年送1年+ 官网再<i class="red">减</i> {{item[2]}} 元
          </p>
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
            <p v-if="exactMatch[0].isSold">关键词在城市<span class="highlight">{{soldCities.map(formatArea).join(', ')}}</span>已售出。<span v-if="availableCities.length">投放在剩余城市价格： 30天 共{{f2y(exactMatch[0].price)}}元、90天 共{{f2y(exactMatch[1].price)}}元，</span>请重新输入关键词推广城市。</p>
            <result-row v-else-if="!exactMatch[0].isSold && exactMatch[0].price" :options="exactMatch" :selected="selected" @change="onSelected" />
            <div v-else>当前标王询价量过大，暂时无法对您的查询词提供报价，请稍后再试。</div>
          </div>
          <div v-if="recommends.length">
            <label>推荐近似关键词</label>
            <div>
              <result-row v-for="item in recommends" :key="item.keyword"
                :options="item" @change="onSelected" :selected="selected" class="result-row"/>
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
  import ResultRow from './result-row'

  import {queryKeywordPrice} from 'api/biaowang'
  import clone from 'clone'

  import {
    f2y,
    fmtAreasInQwt,
    getCnName
  } from 'util'

  const discountInfo = [
    ['标王欢乐套餐', '&%500元关键词买一送一&%', '600'],
    ['标王惊喜套餐', '&%买1500送1500&%', '600'],
    ['标王狂欢套餐', '&%买3000送3000&%', '900'],
    ['标王大单折扣', '标王单笔订单超过6000元享&%8&%折（>6000元）；超10000元享&%75&%折 （≥1万元）', '1500']
  ]

  export default {
    name: 'bw-query-price',
    components: {
      AreaSelector,
      ResultRow,
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
        discountInfo,
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
        loading: false
      }
    },
    computed: {
      exactMatch() {
        return this.skus.slice(0, 1)[0]
      },
      recommends() {
        const { skus, exactMatch } = this
        // 推荐词关键词列表不出现精确匹配关键词
        return skus.slice(1).filter(([{word}]) => exactMatch && exactMatch[0].word !== word)
      },
      soldCities() {
        return this.exactMatch[0].soldCities
      },
      availableCities() {
        return this.exactMatch[0].cities.filter(c =>  !this.exactMatch[0].soldCities.includes(c))
      }
    },
    methods: {
      f2y,
      onSelected(item) {
        if (this.selected.includes(item)) {
          this.selected.splice(this.selected.indexOf(item), 1)
          return
        }
        const inCart = this.selected.find(i => i.word === item.word && i.days !== item.days)
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
            this.loading = true
            const {keyword, devices, areas} = this.form
            try {
              const results = await queryKeywordPrice({
                word: keyword,
                device: devices.length === 2 ? 0 : devices[0],
                cities: areas
              })
              this.skus = results.map(item => {
                return Object.entries(item.soldPriceMap).map(entry => {
                  return {
                    ...item,
                    days: +entry[0],
                    price: entry[1]
                  }
                })
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
  padding: 20px 30px;
  border-radius: 15px;
  color: #fff;
  background: url('http://file.baixing.net/201910/e20912789e2c8ca4cb96739f972dc2ab.png');
  font-size: 13px;
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
</style>
