<template>
  <div class="landing-page">
    <fm-tip class="tip"
            img-url="//file.baixing.net/201903/8d224eb6179a947eecbf0fde089f7ed3.png">
      电话接不停小妙招
    </fm-tip>
    <!-- <div v-if="landingType === LANDING_TYPE_BAIDU_JIMUYU">
      <el-tag effect="dark">基木鱼</el-tag>
      <p class="landing-page-link">投放页面：
        <a :href="landingPage">{{landingPage}}</a>
      </p>
    </div> -->
    <template>
      <el-button-group>
        <el-button v-for="o of LANDING_TYPE_OPTS"
                   :disabled="disabled"
                   :key="o.value"
                   :type="landingType === o.value || landingType === LANDING_TYPE_BAIDU_JIMUYU ? 'primary' : ''"
                   @click="clickLandingType(o.value)">{{ o.label }}
        </el-button>
      </el-button-group>
      <div class="cont">
        <user-ad-selector v-if="landingType === LANDING_TYPE_AD"
                          :disabled="disabled"
                          :all-areas="allAreas"
                          :limit-mvp="false"
                          :selected-id="landingPageId"
                          @select-ad="(ad) => emitUpdateGroup(LANDING_TYPE_AD, ad.url, ad.adId)"
                          @valid-change="(isValid) => setLandingPageValidity(LANDING_TYPE_AD, isValid)" />
        <mvip-selector v-if="landingType === LANDING_TYPE_STORE || landingType === LANDING_TYPE_BAIDU_JIMUYU"
                       :initValue="landingPageId || ''"
                       :disabled="disabled"
                       @change="(url, id) => emitUpdateGroup(LANDING_TYPE_STORE, url, id)"
                       @valid-change="(isValid) => setLandingPageValidity(LANDING_TYPE_STORE, isValid)" />
        <p v-if="landingType === LANDING_TYPE_STORE" class="authing-tip">
          提示： 为提升客户留资效果凤鸣仅支持店铺作为落地页
        </p>
        <p v-if="disabled"
           class="authing-tip">您的推广在审核中，审核通过后可修改落地页，感谢配合！</p>
      </div>
    </template>
  </div>
</template>

<script>
import FmTip from 'com/widget/fm-tip'
import UserAdSelector from 'com/common/ad-selector'
import MvipSelector from 'com/common/mvip-selector'

import {
  landingTypeOpts,
  LANDING_TYPE_AD,
  LANDING_TYPE_STORE,
  LANDING_TYPE_GW,
  LANDING_TYPE_BAIDU_JIMUYU
} from 'constant/fengming'

export default {
  name: 'landing',
  props: {
    allAreas: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    landingType: {
      type: Number,
      required: true
    },
    landingPage: {
      type: String,
      required: true
    },
    landingPageId: {
      type: [Number, String],
      required: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      LANDING_TYPE_OPTS: landingTypeOpts,
      LANDING_TYPE_AD,
      LANDING_TYPE_GW,
      LANDING_TYPE_STORE,
      LANDING_TYPE_BAIDU_JIMUYU
    }
  },
  methods: {
    setLandingPageValidity (type, isValid) {
      this.$emit('valid', isValid)
    },
    emitUpdateGroup (type, page, pageId) {
      return this.$emit('change-landing', {
        landingType: type,
        landingPage: page || '',
        landingPageId: pageId || 0
      })
    },
    clickLandingType (val) {
      if (this.disabled) return this.$message.warning('审核中，无法修改')
      if (this.landingType === val) return
      this.emitUpdateGroup(val)
      this.setLandingPageValidity(val, true)
    }
  },
  components: {
    FmTip,
    UserAdSelector,
    MvipSelector
  }
}
</script>

<style lang="scss" scoped>
.landing-page {
  position: relative;
  width: 540px;
  > .tip {
    position: absolute;
    left: 300px;
    top: 10px;
  }
  > .cont {
    margin-top: 20px;
  }
  .landing-page-link {
    display: flex;
    align-items: center;
    margin-top: 20px;
    a {
      color: #222;
      cursor: pointer;
      width: 540px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .authing-tip {
    display: inline-flex;
    align-items: center;
    font-size: 12px;
    color: $c-main;
  }
}
.page-error-placeholder {
  border: 1px solid #eee;
  border-radius: 4px;
  height: 161px;
  width: 530px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #999;
  & > a {
    color: #ff4401;
    margin-left: 5px;
  }
}
</style>
