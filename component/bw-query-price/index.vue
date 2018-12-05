<template>
  <div class="bg">
    <div class="white-bg">
      <header>标王关键词查价</header>
      <main>
        <el-form :model="form" :rules="rules" label-width="120px" ref="form" label-position="left" class="form">
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
            <result-row :options="exactMatch" :selected="selected" @change="onSelected" />
          </div>
          <div>
            <label>推荐近似关键词</label>
            <div>
              <result-row v-for="item in recommends" :key="item.keyword"
                :options="item" @change="onSelected" :selected="selected" class="result-row"/>
            </div>
          </div>

          <p class="clear" @click="selected = []"><i class="el-icon-close"></i>清除所有选择</p>
          <el-button class="add-to-cart" type="primary" @click="addToCart">加入购物车</el-button>
        </div>
      </main>
    </div>

    <area-selector type="qwt" :all-areas="allAreas"
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
  import ResultRow from './result-row'

  import {queryKeywordPrice} from 'api/biaowang'
  import clone from 'clone'

  import {
    f2y,
    fmtAreasInQwt,
    getCnName
  } from 'util'

  export default {
    name: 'bw-query-price',
    components: {
      AreaSelector,
      ResultRow,
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
          keyword: 'jk',
          devices: [1],
          areas: ['beijing']
        },
        rules: {
          keyword: [{required: true}],
          devices: [{type: 'array', required: true}],
          areas: [{type: 'array', required: true, trigger: 'change'}]
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
        return this.skus.slice(1)
      }
    },
    methods: {
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
            this.loading = false
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
  padding: 10px 10px 30px 10px;
  background-color: #f4f4f4;

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
</style>
