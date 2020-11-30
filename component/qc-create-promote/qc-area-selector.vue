<template>
  <el-dialog
    :visible="visible"
    :close-on-click-modal="false"
    :before-close="ok"
    :show-close="false"
  >
    <main class="main">
      <div v-for="(province, i) in provinceList" :key="i">
        <el-checkbox
          class="checkbox-item"
          :disabled="disabledProvinceCheck(province)"
          v-model="province.checked"
          @change="provinceCheckedChange(province)"
        >
          <span :class="{ selected: province.checked }">{{
            province.name
          }}</span>
        </el-checkbox>
      </div>
    </main>
    <div slot="title" class="dialog-header">
      <h5 class="title">区域选择<span>(仅可选择两个地区)</span></h5>
    </div>
    <div slot="footer" class="dialog-footer">
      <div class="buttons">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="ok">确认</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import isequal from "lodash.isequal";
import { getQcAllAreas } from "api/qianci";
import clone from "clone";
import gStore from "../store";

export default {
  name: "qc-area-selector",
  props: {
    maxAreaLength: Number,
    areas: {
      type: Array,
      required: true,
      default: () => []
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      selectedAreas: [],
      originSelectedAreas: [],
      originProvinceList: [],
      provinceList: []
    };
  },
  fromMobx: {
    allQianciAreas: () => gStore.allQianciAreas
  },
  watch: {
    visible(v) {
      if (v) {
        if (this.provinceList.length === 0) {
          const { cnToEnMap, provinces } = this.allQianciAreas;
          const specialCityList = ["北京", "重庆", "上海", "天津"];
          const provinceList = [];
          Object.keys(provinces).forEach(k => {
            if (!specialCityList.includes(k)) {
              provinceList.push({
                name: k,
                en: cnToEnMap[k],
                checked: false,
                cities: provinces[k]
              });
            }
          });
          provinceList.push(
            ...specialCityList.map(k => {
              return {
                name: k,
                en: cnToEnMap[k],
                checked: false,
                cities: provinces[k]
              };
            })
          );
          this.provinceList = provinceList;
        }
        this.originProvinceList = clone(this.provinceList);
        this.originSelectedAreas = clone(this.selectedAreas);
      }
    },
    areas(v) {
      console.log(v, this.selectedAreas);
      if (isequal(v, this.selectedAreas)) {
        return;
      }
      this.selectedAreas = [...v];
    }
  },
  mounted() {
    this.$bus.$on("updateQcAreaSelectorView", province => {
      const removeProvinceIndex = this.selectedAreas.findIndex(
        x => x.name === province.name
      );
      this.selectedAreas.splice(removeProvinceIndex, 1);
      const removeProvince = this.provinceList.find(
        x => x.name === province.name
      );
      removeProvince.checked = false;
    });
  },
  methods: {
    disabledProvinceCheck(province) {
      return (
        !this.selectedAreas.map(p => p.name).includes(province.name) &&
        this.selectedAreas.length === this.maxAreaLength
      );
    },
    provinceCheckedChange(province) {
      if (province.checked) {
        this.selectedAreas.push(province);
      } else {
        const index = this.selectedAreas.findIndex(
          x => province.name === x.name
        );
        if (index > -1) {
          this.selectedAreas.splice(index, 1);
        }
      }
    },
    cancel() {
      this.provinceList = this.originProvinceList;
      this.selectedAreas = this.originSelectedAreas;
      this.$emit("cancel");
    },
    ok() {
      const areas = this.selectedAreas.concat([]);
      this.$emit("ok", [...areas]);
    }
  }
};
</script>

<style lang="postcss" scoped>
.tip {
  color: red;
  font-size: 11px;
}

.dialog-header {
  width: 100%;
  display: flex;
  text-align: center;
  line-height: 40px;
  & .title {
    text-indent: 10px;
    font-size: 18px;
    color: #565656;
    & span {
      font-size: 14px;
    }
  }
  & .buttons {
    margin-left: auto;
    margin-right: 26px;
  }
}

.main:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}

.checkbox-item {
  width: 120px;
  float: left;
  display: inline-block;
  margin-bottom: 20px;
}
</style>
