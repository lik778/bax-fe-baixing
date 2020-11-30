<template>
  <div class="page-create-promote bg" :class="isEdit ? 'is-edit' : 'is-create'">
    <div class="white-bg">
      <main>
        <product-intro></product-intro>
        <el-form
          :model="form"
          :rules="rules"
          label-width="120px"
          ref="form"
          label-position="left"
          class="form"
          @submit.native.prevent
        >
          <!-- 选择推广类型 -->
          <el-form-item label="推广类型" prop="type">
            <div
              v-for="item in displayTypes"
              :class="['type-card', form.type == item.id ? 'active' : '']"
              :key="item.id"
              @click="() => (isEdit ? '' : selectType(item.id))"
            >
              <div class="hotsale-icon" v-if="item.id == 2">NEW</div>
              <div class="card-title">{{ item.title }}</div>
              <div class="card-tip">{{ item.info }}</div>
            </div>
          </el-form-item>

          <!-- 关键词与区域选择 -->
          <template v-if="isTypeSelected">
            <el-form-item label="推广关键词">
              <!-- TODO fix click -->
              <el-input
                :disabled="restKeywordLength <= 0"
                v-model="input.keyword"
                class="input-keyword"
                maxlength="10"
                @keypress.enter.native="(e, val) => selectKeyword(val)"
                @focus="tip.keyword = ''"
              />
              <el-button
                class="confirm-keyword-btn"
                v-if="input.keyword"
                type="text"
                @click="(e, val) => selectKeyword(val)"
                >确定</el-button
              >
              <span v-if="tip.keyword" class="confirm-keyword-tip">
                <i class="el-icon el-icon-warning-outline" />
                {{ tip.keyword }}</span
              >
              <div class="keywords-con">
                <el-tag
                  v-for="(word, idx) in form.keywords"
                  class="keyword-tag"
                  :closable="!isEdit"
                  :key="idx"
                  @close="() => removeKeyword(word)"
                  >{{ word }}</el-tag
                >
              </div>
            </el-form-item>
            <el-form-item label="推广区域" prop="areas">
              <el-tag
                type="success"
                :closable="!isEdit"
                class="kw-tag"
                v-for="area in form.areas"
                :key="area.name"
                @close="removeArea(area)"
              >
                {{ area.name }}
              </el-tag>
              <i
                class="el-icon-plus"
                v-if="!isEdit"
                @click="areaDialogVisible = true"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                class="check-word-btn"
                :disabled="isEdit"
                :loading="loading"
                type="primary"
                @click="checkWord"
                >检查</el-button
              >
            </el-form-item>
          </template>
        </el-form>

        <!-- 关键词录入 -->
        <template v-if="keywordsPanelVisible">
          <select-keywords :promote="promote" :form="form" :isEdit="isEdit" />
        </template>
      </main>
    </div>
    <qc-area-selector
      :maxAreaLength="maxAreaLength"
      :areas="form.areas"
      :visible="areaDialogVisible"
      @ok="onAreasChange"
      @cancel="areaDialogVisible = false"
    />
  </div>
</template>

<script>
import { Message } from "element-ui";
import { getPromote, createPreferredWords } from "api/qianci";
import ProductIntro from "com/qc-create-promote/product-intro";
import QcAreaSelector from "com/qc-create-promote/qc-area-selector";
import { API_SUCCESS } from "constant/api";
import {
  ONE_WORD_TWO_PROVINCE,
  THREE_WORD_ONE_PROVINCE
} from "constant/qianci";
import SelectKeywords from "./select-keywords";
import gStore from "../store";

export default {
  name: "qc-create-promote",
  components: { ProductIntro, QcAreaSelector, SelectKeywords },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  fromMobx: {
    allQianciAreas: () => gStore.allQianciAreas
  },
  data() {
    return {
      promote: null,
      input: {
        keyword: ""
      },
      form: {
        keywords: [],
        areas: [],
        type: null
      },
      rules: {
        areas: [
          {
            validator: (rule, value, callback) => {
              if (this.restAreaLength) {
                return callback(
                  new Error(`还需要选择 ${this.restAreaLength} 个区域`)
                );
              }
              callback();
            },
            trigger: ["change", "blur"]
          }
        ]
      },
      tip: {
        keyword: ""
      },
      loading: false,
      areaDialogVisible: false,
      keywordsPanelVisible: false,
      isEdit: false,
      options: {
        types: [
          {
            title: "一词两省",
            info: "支持首页宝推广，让您的网站上百度首页",
            id: ONE_WORD_TWO_PROVINCE
          },
          {
            title: "三词一省",
            info: "支持 SEO 优化等更多专业版官网建站功能",
            id: THREE_WORD_ONE_PROVINCE
          }
        ]
      }
    };
  },
  computed: {
    isTypeSelected() {
      return !!this.form.type;
    },
    maxKeywordLength() {
      return {
        [ONE_WORD_TWO_PROVINCE]: 1,
        [THREE_WORD_ONE_PROVINCE]: 3
      }[this.form.type];
    },
    restKeywordLength() {
      return this.maxKeywordLength - this.form.keywords.length;
    },
    maxAreaLength() {
      return {
        [ONE_WORD_TWO_PROVINCE]: 2,
        [THREE_WORD_ONE_PROVINCE]: 1
      }[this.form.type];
    },
    restAreaLength() {
      return this.maxAreaLength - this.form.areas.length;
    },
    displayTypes() {
      const raw = this.options.types;
      return this.isEdit ? raw.filter(x => x.id == this.form.type) : raw;
    }
  },
  watch: {
    promote: {
      deep: true,
      immediate: true,
      handler(n) {
        if (n) {
          const { coreWordInfos = [] } = n;
          const keywords = coreWordInfos.map(x => x.coreWord);
          // TODO refactor
          this.form.type =
            keywords.length === 3
              ? [THREE_WORD_ONE_PROVINCE]
              : [ONE_WORD_TWO_PROVINCE];
          this.form.keywords = keywords;
          const { enToCnMap, provinces } = this.allQianciAreas;
          this.form.areas = n.provinces.map(en => {
            const cnName = enToCnMap[en];
            return {
              name: cnName,
              en,
              checked: true,
              cities: [...provinces[cnName]]
            };
          });
          this.keywordsPanelVisible = true;
        }
      }
    },
    form: {
      deep: true,
      immediate: true,
      handler(n, o) {
        if (!this.isEdit) {
          this.keywordsPanelVisible = false;
        }
      }
    }
  },
  async mounted() {
    const { id } = this.$route.query;

    // 获取千词地区信息
    if (Object.keys(gStore.allQianciAreas).length === 0) {
      gStore.getQianciAreas();
    }

    if (id) {
      this.isEdit = true;
      const promote = await getPromote(id);
      this.promote = promote;
    }
  },
  methods: {
    selectType(newType) {
      this.form.type = newType;
      this.tip.keyword = "";
      this.initFormVals();
    },
    selectKeyword(value = this.input.keyword) {
      const valid =
        value &&
        this.restKeywordLength > 0 &&
        !this.form.keywords.includes(value) &&
        this.validKeywords([value], false);
      if (valid) {
        this.form.keywords.push(value);
        this.input.keyword = "";
        this.tip.keyword = "";
      }
    },
    removeKeyword(wordToRemove) {
      this.form.keywords.splice(
        this.form.keywords.findIndex(x => x === wordToRemove),
        1
      );
      this.validKeywords();
    },
    async checkWord() {
      this.$refs.form.validate(async isValid => {
        const isKeywordValid = this.validKeywords();
        if (isValid && isKeywordValid) {
          this.keywordsPanelVisible = true;
        }
      });
    },
    removeArea(area) {
      this.form.areas = this.form.areas.filter(i => i.name !== area.name);
      this.$bus.$emit("updateQcAreaSelectorView", area);
    },
    onAreasChange(areas) {
      this.form.areas = [...areas];
      this.areaDialogVisible = false;
    },
    validKeywords(words = this.form.keywords, validLen = false) {
      if (words.find(x => !/^[\u4E00-\u9FA5A-Za-z0-9]{2,10}$/.test(x))) {
        this.tip.keyword =
          "核心词不能是特殊字符，单个核心词长度限制为 2-10 个字";
        return false;
      }
      if (!validLen) {
        return true;
      }
      if (this.isTypeSelected) {
        this.tip.keyword = this.restKeywordLength
          ? `您还需输入 ${this.restKeywordLength} 个关键词`
          : "";
        return !this.tip.keyword;
      }
      return false;
    },
    initFormVals() {
      this.form.keywords = [];
      this.form.areas.map(area =>
        this.$bus.$emit("updateQcAreaSelectorView", area)
      );
      this.form.areas = [];
    }
  }
};
</script>

<style lang="postcss" scoped>
.page-create-promote {
  & > .white-bg {
    background-color: #fff;
    & .warning-text {
      color: #ff6350;
    }
    & .kw-tag {
      margin-right: 10px;
    }
    & > main {
      box-shadow: 0px 2px 9px 0px rgba(83, 95, 127, 0.1);
      min-height: 700px;
      padding: 45px 60px;
    }
    & > main .el-icon-plus {
      padding: 4px;
      font-size: 18px;
      vertical-align: middle;
      cursor: pointer;
    }
  }

  &.is-edit {
    & .keywords-con {
      margin-top: 0;
    }
    & .input-keyword {
      display: none;
    }
  }
}
.el-form-item {
  margin-bottom: 36px;
}
.type-card {
  position: relative;
  display: inline-block;
  margin-top: 10px;
  margin-left: 28px;
  width: 245px;
  height: 100px;
  border: solid 1px #ccc;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.1s;

  &:first-child {
    margin-left: 0;
  }

  & > .hotsale-icon {
    position: absolute;
    top: -7px;
    right: 6px;
    width: 48px;
    height: 32px;
    line-height: 23px;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAiCAMAAAAqN3oYAAABBVBMVEUAAAC+SEG6RS21Pie3Piq7Sjq5QzC7Tye2QCa1PiW2QCe1QSi2RSy0PSW1PiW2Pia2PyW0Pya2Pie2QCmyQybGQI67QUW7Qjm1PybLQ7nCQnvOQLnLSMfJRrDOPqTCTa/LQJq/TaC9R2fAQFu+WuTHTMrCVNi3aPu3afzFTse+VdHPPKrBUL++Wc68SoW9UqLLPYC3Z+bKSLfKSMvLR8nEUtrFUNjHTNLMRcfAWeXHTtTIS9DGT9bCVd/JSc3PQL++W+nBVuHBV+PDU9zJSs6/Wue7YPHMRMW8X++9Xu3DVN26YvS9XevNQ8POQsK5ZPbQP73RPbq3ZvrNRMS+XOrSO7fLSMoTLDc7AAAAM3RSTlMAAwssGAgPBiEzJhURSU5DPjhUHRqhY1ou4Yzw5s3GtrafdXX58e/m5d/d3crBinBwUlLt/twKAAACO0lEQVQ4y43U6XbaMBAF4HqR990sCU3Spvu+EUIChJJSQgADDVDe/1E6Ix1JYNcn+Le+c680kp/gpxz8wWIGTELUAz5CTEQoyPd3q9VquVzOZnd395MsGwxG19e/bm9upsNh6/Ky1+u0u93f/ebJD0KNQoy3KBCgmHBxC6KFotNpt1E0L04MooAwDX0n4z7LNoPRiIkpywDAxMWVbpgKhHgWkHwrWou3anNxZXkEievIjAnNEKK1L8Zrx0Wi6trqMQFki2Ku6SojEFIQcusoaKv1XBKZsX9YPSGaIMbzxUKQGRAQE5qBIXwgKLpMYK3FT0lQyBFCrRKxQ/IjnHIhD2uM4o8gVGxkBgiZwbY+p0ISmrFBURxIn2cgeRAEN4IZQOTxSsH2gUISlgEkl9EFscWtM7FHsuy/I+zzgSAB8PBXElYrJ+TNWtCtg5CEi+IIZQYKTuAmf/38Sl6TVj5DirNvcJPZe7HD+vkHvCbF+y4P62O1HtrsvZiq7tiRn7x49mZIhRyhPKynz18mfmQ7umoq9O3rlhZHfpB8+dTbGeFWXJOzRhL4UaxZOr59IGDciqXZcegHtfP3KIBwsTiu1gI/jG3NqrggFP4fMzw9dTQ7CgMo+FoMZI2FgjCyNSfVPYOYVHCkYpRzhAXrjVMmTht1LHTkYIAqwK7y3JQVTGrVYyiUsEKp6+XWC6QQVRT0g8AXhVSiFECxoB3HdrFQufLcSmpZaaWkUElBw/OMfKFHokxCTBFwqCpd/w8mE/YTkb+nhgAAAABJRU5ErkJggg==);
    background-size: 100%;
    background-repeat: no-repeat;
    color: white;
    font-size: 10px;
    font-style: italic;
    font-weight: 500;
    text-indent: -2px;
  }
  & > .card-title {
    height: 35px;
    line-height: 35px;
    border-bottom: dashed 1px #ccc;
    background: #f2f2f2;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    transition: 0.3s;
  }
  & > .card-tip {
    font-size: 12px;
    color: #666;
    line-height: 68px;
  }

  &.active {
    position: relative;
    border-color: #ff755a;

    &::after {
      content: "";
      position: absolute;
      bottom: -8px;
      right: -8px;
      width: 20px;
      height: 20px;
      border: solid 2px white;
      border-radius: 50%;
      background-color: #ff755a;
      background-image: url("data:image/svg+xml,%3Csvg width='24px' height='24px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E %3Cdefs%3E %3Ccircle id='path-1' cx='9' cy='9' r='9'%3E%3C/circle%3E %3C/defs%3E %3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E %3Cg transform='translate(-840.200000, -440.200000)'%3E %3Cg transform='translate(231.000000, 351.000000)'%3E %3Cg transform='translate(383.000000, 0.000000)'%3E %3Cg transform='translate(229.000000, 92.000000)'%3E %3Cmask id='mask-2' fill='white'%3E %3Cuse xlink:href='%23path-1'%3E%3C/use%3E %3C/mask%3E %3Ccircle stroke='%23FFFFFF' stroke-width='3' cx='9' cy='9' r='10.9'%3E%3C/circle%3E %3Cpath d='M15.1825897,5.10610289 L15.270383,5.1771462 C15.5176407,5.41592024 15.5221862,5.81234159 15.2920079,6.05069827 L8.21929829,13.3747035 C7.98398364,13.6183789 7.59450525,13.624017 7.34552366,13.3835782 L7.31018198,13.345721 C7.30170601,13.3382661 7.29337514,13.330564 7.28519888,13.3226146 L3.20243916,9.35312536 C2.96168676,9.1190523 2.93454279,8.75228384 3.12705783,8.48573457 L3.161,8.445 L3.20137729,8.41142585 C3.46762902,8.21926922 3.84204075,8.23905634 4.08261162,8.4729529 L7.765,12.053 L14.3966083,5.18602099 C14.6057769,4.9694206 14.9367539,4.94089912 15.1825897,5.10610289 Z' fill='%23FFFFFF' mask='url(%23mask-2)'%3E%3C/path%3E %3C/g%3E %3C/g%3E %3C/g%3E %3C/g%3E %3C/g%3E %3C/svg%3E");
      background-repeat: no-repeat;
      background-size: 20px;
    }

    & > .card-title {
      border-bottom: dashed 1px #ffb6a8;
      background-color: #ff755a;
      color: white;
    }
  }
}
.input-keyword {
  width: 200px;
}
.confirm-keyword-btn {
  margin-left: 12px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  line-height: 0;
  color: #ff6350;

  &:hover {
    opacity: 0.9;
  }
}
.confirm-keyword-tip {
  color: #ff6350;
  margin-left: 12px;
  font-size: 12px;

  & > .el-icon {
    font-size: 14px;
  }
}
.keywords-con {
  margin-top: 13px;

  & > .keyword-tag {
    margin-left: 10px;
    color: #00a5ff;
    border-color: #00a5ff;
    background: #eef9ff;
    font-size: 14px;

    &:first-child {
      margin-left: 0;
    }

    & /deep/ .el-tag__close {
      color: #00a5ff;

      &:hover {
        background-color: #00a5ff;
        color: white;
      }
    }
  }
}
.check-word-btn {
  width: 107px;
  height: 32px;
  line-height: 0px;
}
</style>
