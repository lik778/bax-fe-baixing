<template>
  <div class="container">
    <section>
      <div class="desc">单元名称：</div>
      <el-input
        class="input"
        :value="group.name"
        @input="changeGroupName"
        placeholder="请输入单元名称"
      />
    </section>
    <section>
      <div class="landing desc">投放页面：</div>
      <landing-comp
        :landing-type="group.landingType"
        :landing-page="group.landingPage"
        :landing-page-id="group.landingPageId"
        :all-areas="allAreas"
        v-on="$listeners"
      />
    </section>
  </div>
</template>

<script>
import LandingComp from './landing'

export default {
  name: 'landing-page-comp',
  props: {
    group: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    },
    allAreas: {
      type: Array
    }
  },
  methods: {
    changeGroupName (val) {
      this.$emit('change-name', val)
    }
  },
  components: {
    LandingComp
  }
}
</script>

<style lang="scss" scoped>
.container {
  > section {
    display: flex;
    align-items: center;
    &:not(:last-child) {
      margin-bottom: 10px;
    }
    > .desc {
      flex: 0 0 70px;
      margin-right: 20px;
      color: #6a778c;
      &.landing {
        align-self: flex-start;
        margin-top: 10px;
      }
    }
    > .input {
      width: 530px;
    }
  }
}
</style>
