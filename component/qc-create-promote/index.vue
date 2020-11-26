<template>
  <div class="bg">
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
          <!-- TODO 上新标志 -->
          <!-- 选择推广类型 -->
          <el-form-item label="推广类型" prop="type">
            <div
              v-for="item in options.types"
              :class="['type-card', form.type == item.id ? 'active' : '']"
              :key="item.id"
              @click="() => selectType(item.id)"
            >
              <div class="card-title">{{ item.title }}</div>
              <div class="card-tip">{{ item.info }}</div>
            </div>
          </el-form-item>

          <!-- 关键词与区域选择 -->
          <template v-if="isTypeSelected">
            <el-form-item label="推广关键词">
              <el-input
                :disabled="isEdit || restKeywordLength <= 0"
                v-model="input.keyword"
                style="width: 200px"
                maxlength="10"
                @keypress.enter.native="(e, val) => selectKeyword(val)"
              />
              <el-button
                class="confirm-keyword-btn"
                v-if="input.keyword"
                type="text"
                @click="selectKeyword"
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
                  closable
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
            title: "两省一词",
            info: "支持首页宝推广，让您的网站上百度首页",
            id: 1
          },
          {
            title: "一省三词",
            info: "支持 SEO 优化等更多专业版官网建站功能",
            id: 2
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
        1: 1,
        2: 3
      }[this.form.type];
    },
    restKeywordLength() {
      return this.maxKeywordLength - this.form.keywords.length;
    },
    maxAreaLength() {
      return {
        1: 2,
        2: 1
      }[this.form.type];
    },
    restAreaLength() {
      return this.maxAreaLength - this.form.areas.length;
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
          // TODO 有木有枚举？
          this.form.type = keywords.length === 3 ? 2 : 1;
          this.form.keywords = keywords;
          const { enToCnMap, provinces } = this.allQianciAreas;
          this.form.areas = n.provinces.map(en => {
            const cnName = enToCnMap[en];
            return {
              name: cnName,
              en,
              checked: true,
              cities: provinces[cnName]
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
    },
    "form.keywords": {
      deep: true,
      immediate: true,
      handler(n) {
        this.ruleKeyword();
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

    /* for test */
    this.selectType(2);
    this.selectKeyword("一光");
    this.selectKeyword("二军");
    this.selectKeyword("三叠");
    this.onAreasChange([
      {
        name: "山东",
        en: "shandong",
        checked: true,
        cities: [
          "东营",
          "德州",
          "滨州",
          "莱芜",
          "济南",
          "临沂",
          "济宁",
          "菏泽",
          "聊城",
          "青岛",
          "泰安",
          "日照",
          "烟台",
          "潍坊",
          "淄博",
          "威海",
          "枣庄"
        ]
      }
    ]);
  },
  methods: {
    selectType(newType) {
      this.form.type = newType;
      this.initFormVals();
      this.ruleKeyword();
    },
    selectKeyword(value = this.input.keyword) {
      if (value && this.restKeywordLength > 0) {
        this.form.keywords.push(value);
        this.input.keyword = "";
      }
    },
    removeKeyword(wordToRemove) {
      this.form.keywords.splice(
        this.form.keywords.findIndex(x => x === wordToRemove),
        1
      );
    },
    async checkWord() {
      this.$refs.form.validate(async isValid => {
        if (isValid && this.ruleKeyword()) {
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
    ruleKeyword() {
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
      this.form.areas = [];
    }
  }
};
</script>

<style lang="postcss" scoped>
div.bg {
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
}
.el-form-item {
  margin-bottom: 36px;
}
.type-card {
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
      background-image: url("data:image/svg+xml,%3C?xml version='1.0' encoding='UTF-8'?%3E %3Csvg width='24px' height='24px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E %3Cdefs%3E %3Ccircle id='path-1' cx='9' cy='9' r='9'%3E%3C/circle%3E %3C/defs%3E %3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E %3Cg transform='translate(-840.000000, -440.000000)'%3E %3Cg transform='translate(231.000000, 351.000000)'%3E %3Cg transform='translate(383.000000, 0.000000)'%3E %3Cg transform='translate(229.000000, 92.000000)'%3E %3Cmask id='mask-2' fill='white'%3E %3Cuse xlink:href='%23path-1'%3E%3C/use%3E %3C/mask%3E %3Ccircle stroke='%23FFFFFF' stroke-width='3' cx='9' cy='9' r='10.5'%3E%3C/circle%3E %3Cpath d='M15.1825897,5.10610289 L15.270383,5.1771462 C15.5176407,5.41592024 15.5221862,5.81234159 15.2920079,6.05069827 L8.21929829,13.3747035 C7.98398364,13.6183789 7.59450525,13.624017 7.34552366,13.3835782 L7.31018198,13.345721 C7.30170601,13.3382661 7.29337514,13.330564 7.28519888,13.3226146 L3.20243916,9.35312536 C2.96168676,9.1190523 2.93454279,8.75228384 3.12705783,8.48573457 L3.161,8.445 L3.20137729,8.41142585 C3.46762902,8.21926922 3.84204075,8.23905634 4.08261162,8.4729529 L7.765,12.053 L14.3966083,5.18602099 C14.6057769,4.9694206 14.9367539,4.94089912 15.1825897,5.10610289 Z' fill='%23FFFFFF' mask='url(%23mask-2)'%3E%3C/path%3E %3C/g%3E %3C/g%3E %3C/g%3E %3C/g%3E %3C/g%3E %3C/svg%3E");
      background-repeat: repeat;
      background-size: 20px;
    }

    & > .card-title {
      border-bottom: dashed 1px #ffb6a8;
      background-color: #ff755a;
      color: white;
    }
  }
}
.confirm-keyword-btn {
  margin-left: 12px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  line-height: 0;
  color: #ff6350;
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
