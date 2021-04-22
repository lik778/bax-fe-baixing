<template>
  <div class="landing-page">
    <fm-tip class="tip"
            img-url="//file.baixing.net/201903/8d224eb6179a947eecbf0fde089f7ed3.png">
      电话接不停小妙招
    </fm-tip>
    <el-button-group>
      <el-button v-for="o of LANDING_TYPE_OPTS"
                 :key="o.value"
                 :type="landingType === o.value ? 'primary' : ''"
                 @click="clickLandingType(o.value)">{{ o.label }}
      </el-button>
    </el-button-group>
    <div class="cont">
      <user-ad-selector v-if="landingType === LANDING_TYPE_AD"
                        :all-areas="allAreas"
                        :limit-mvp="false"
                        :selected-id="landingPageId"
                        @select-ad="(ad) => emitUpdateGroup(LANDING_TYPE_AD, ad.url, ad.adId)"
                        @valid-change="(isValid) => setLandingPageValidity(LANDING_TYPE_AD, isValid)" />
      <gw-page-selector v-if="landingType === LANDING_TYPE_GW"
                        :init-value="landingPage"
                        @change="v => emitUpdateGroup(LANDING_TYPE_GW, v)"
                        @valid-change="(isValid) => setLandingPageValidity(LANDING_TYPE_GW, isValid)" />
      <mvip-selector v-if="landingType === LANDING_TYPE_STORE"
                     :initValue="landingPageId || ''"
                     @change="(url, id) => emitUpdateGroup(LANDING_TYPE_STORE, url, id)"
                     @validChange="(isValid) => setLandingPageValidity(LANDING_TYPE_STORE, isValid)" />
      <p v-if="disabled"
         class="authing-tip">您的推广在审核中，审核通过后可修改落地页，感谢配合！</p>
    </div>
  </div>
</template>

<script>
import FmTip from 'com/widget/fm-tip'
import UserAdSelector from 'com/common/ad-selector'
import GwPageSelector from 'com/common/gw-page-selector'
import MvipSelector from 'com/common/mvip-selector'

import {
  landingTypeOpts,
  LANDING_TYPE_AD,
  LANDING_TYPE_STORE,
  LANDING_TYPE_GW
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
      LANDING_TYPE_STORE
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
    }
  },
  components: {
    FmTip,
    UserAdSelector,
    GwPageSelector,
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
