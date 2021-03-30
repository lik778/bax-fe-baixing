<template>
  <div class="landing-page">
    <fm-tip
      class="tip"
      img-url="//file.baixing.net/201903/8d224eb6179a947eecbf0fde089f7ed3.png"
    >
      电话接不停小妙招
    </fm-tip>
    <el-button-group>
      <el-button
        v-for="o of LANDING_TYPE_OPTS"
        :key="o.value"
        :type="group.landingType === o.value ? 'primary' : ''"
        @click="clickLandingType(o.value)"
      >
        {{ o.label }}
      </el-button>
    </el-button-group>
    <div class="cont">
      <user-ad-selector
        ref="userAdSelector"
        :type="adSelectorType"
        v-if="group.landingType === LANDING_TYPE_AD"
        :all-areas="$attrs.allAreas"
        :limit-mvp="false"
        :selected-id="group.landingPageId"
        @select-ad="(ad) => emitUpdateGroup(LANDING_TYPE_AD, ad.id, ad.url)"
        @valid-change="(isValid) => setLandingPageValidity(LANDING_TYPE_AD, isValid)"
      />
      <gw-page-selector
        v-if="group.landingType === LANDING_TYPE_GW"
        :value="group.landingPage"
        @change="v => emitUpdateGroup(LANDING_TYPE_GW, v)"
        @valid-change="(isValid) => setLandingPageValidity(LANDING_TYPE_GW, isValid)"
      />
      <mvip-selector
        v-if="group.landingType === LANDING_TYPE_STORE"
        :initValue="group.landingPage"
        @change="(url, id) => emitUpdateGroup(LANDING_TYPE_STORE, url, id)"
        @validChange="(isValid) => setLandingPageValidity(LANDING_TYPE_STORE, isValid)"
      />
    </div>
  </div>
</template>

<script>
import FmTip from 'com/widget/fm-tip'
import UserAdSelector from 'com/common/user-ad-selector'
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
  props: ['group'],
  data () {
    return {
      adSelectorType: '',
      isErrorPage: false,

      LANDING_TYPE_OPTS: landingTypeOpts,
      LANDING_TYPE_AD,
      LANDING_TYPE_GW,
      LANDING_TYPE_STORE
    }
  },
  mounted () {
    if (this.group.landingType !== LANDING_TYPE_AD) {
      this.adSelectortype = ''
    }
  },
  methods: {
    setLandingPageValidity (type, isValid) {
      this.$emit('valid', 'page', isValid)
    },
    emitUpdateGroup (type, page, pageId) {
      return this.$emit('update-group', {
        landingType: type,
        landingPage: page || '',
        landingPageId: pageId || ''
      })
    },
    clickLandingType (val) {
      if (this.group.landingType === val) return
      this.adSelectorType = ''
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
