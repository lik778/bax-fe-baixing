<template>
  <section class="editor">
    <promotion-creative-tip />
    <footer v-if="!isFormReadonly">
      <el-button
        检查推广是否可用
      </el-button>
    </footer>
  </section>
</template>

<script>
import PromotionCreativeTip from './promotion-creative-tip'
import TextLimitTip from './text-limit-tip'

import { Message } from 'element-ui'

import {
  creativeContentPlaceholder
} from 'constant/tip'

import {
  checkCreativeContent
} from 'api/fengming'

export default {
  name: 'qwt-creative-editor',
  components: {
    PromotionCreativeTip,
    TextLimitTip
  },
  props: {
