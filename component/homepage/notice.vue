<template>
  <div class="homepage-notices" :style="{height}" ref="container">
    <ul class="notice-list"
      v-if="noticeList"
      @mouseenter="pauseScroll = true"
      @mouseleave="execContainerScroll"
    >
      <template v-if="noticeList.length">
        <li
          class="notice-item"
          v-for="notice in noticeList"
          :key="notice.id"
        >
          <slot :notice="Object.assign({formatDate}, notice)"></slot>
        </li>
        <li class="footer">已经没有更多{{noticeTitle}}啦~</li>
      </template>
      <div v-else class="notice-placeholder"><i class="el-icon-info" />暂无{{noticeTitle}}</div>
    </ul>
    <div v-else class="notice-placeholder">
      <i class="el-icon-loading" />正在加载{{noticeTitle}}
    </div>
  </div>
</template>

<script>
import moment from 'moment'
const noticeTexts = {
  fengming: '账户推广通知',
  site: '官网留言通知'
}

export default {
  name: 'homepage-notices',
  beforeDestroy() {
    this.stopScroll = true
  },
  methods: {
    formatDate(date) {
      return moment(date).format('YYYY.MM.DD')
    },
    execContainerScroll() {
      const containerRef = this.$refs.container
      const containerHeight = containerRef.clientHeight
      const listHeght = containerRef.querySelector('.notice-list').clientHeight

      this.pauseScroll = false
      let scrollPos = containerRef.scrollTop
      let timer = null
      const scroller = () => {
        if (this.pauseScroll || this.stopScroll) return
        if (listHeght < scrollPos + containerHeight) scrollPos = 0
        scrollPos++
        containerRef.scroll(0, scrollPos)
        clearTimeout(timer)
        timer = setTimeout(scroller, 100)
      }
      // 超过容器50px高度，执行滚动
      if (listHeght >= containerHeight + 50) {
        scroller()
      }
    }
  },
  props: {
    height: [Number, String],
    type: {
      required: true,
      validator(value) {
        return ['fengming', 'site'].indexOf(value) !== -1
      }
    },
    noticeList: {
      required: true
    }
  },
  watch: {
    noticeList(val) {
      console.log(val)
    }
  },
  computed: {
    noticeTitle() {
      return noticeTexts[this.type]
    }
  },
  watch: {
    async noticeList(val) {
      if (val && val.length) {
        await this.$nextTick()
        this.execContainerScroll()
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
  .homepage-notices {
    margin-top: 15px;
    overflow-y: hidden;
    &::-webkit-scrollbar { width: 0 !important }
    &.element { -ms-overflow-style: none; }
    &.element { overflow: -moz-scrollbars-none; }
  }
  .notice-list {
    color: #666;
    font-size: 14px;
    padding-bottom: 30px;
    & .notice-item {
      text-indent: 1em;
      margin-top: 20px;
      overflow : hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      padding-right: 1em;
    }
    & .footer {
      margin-top: 30px;
      font-size: 13px;
      color: #999;
      text-align: center;
    }
  }
  .notice-placeholder {
    height: 184px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 16px;
    & .el-icon-info, & .el-icon-loading {
      margin-right: 4px;
    }
  }
</style>
