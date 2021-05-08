<template>
  <div :class="classnames">
    <div class="title">多图组件，图文结合，更丰富的信息呈现</div>
    <div class="creative-con">
      <div class="creative-image-wrapper">
        <img
          v-for="(image, idx) in srcs"
          class="creative-image"
          :src="image.url"
          :key="image.url+idx"
        />
      </div>
      <div class="creative-text">
        快速帮助您提升图片数量、质量、降低客户管理成本，提升相关性深度，展示品牌、业务、优势等信息。
      </div>
    </div>
    <div class="footer">
      <span class="url">baixing.com</span>
      <span class="btn-like">评价</span>
      <span class="btn-like">广告</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['srcs', 'type', 'classname'],
  computed: {
    classnames () {
      return ['material-preview', this.type || '', this.classname || ''].join(' ')
    }
  }
}
</script>

<style lang="scss">
/* main styles */
.material-preview {
  display: flex;
  flex-direction: column;
  padding: 6px;
  width: 100%;
  background: #a2a2a2;
  user-select: none;

  &.wap-preview {
    .title {
      padding-left: 9px;
    }
    .creative-text {
      padding: 0 9px;
    }
  }

  .title {
    padding-left: 7px;
    line-height: 37px;
    color: #333;
  }
  .creative-con {
    .creative-image-wrapper {
      display: flex;
      padding: 6px 8px;
      justify-content: space-between;
      gap: 8px;
      background: white;
    }
    .creative-image {
      flex-shrink: 0;
    }
    .creative-text {
      font-size: 14px;
      color: #5b5b5b;
    }
  }
  .footer {
    height: 35px;
    line-height: 45px;
    font-size: 12px;
    color: #666;

    .url {
      margin-left: 7px;;
      margin-right: 13px;
    }
    .btn-like {
      margin-right: 7px;
    }
  }
}
/* types styles */
.big-pic {
  &.pc-preview {
    .creative-con {
      display: flex;
      padding: 6px 8px;
      gap: 8px;
      width: 475px;
      height: 110px;
      background: white;

      .creative-image-wrapper {
        padding: 0;
      }
      .creative-image {
        width: 295px;
        // width: 168px;
        height: 95px;
      }
    }
  }
  &.wap-preview {
    width: 406px;
    height: 272px;

    .title {
      font-size: 16px;
    }
    .creative-con {
      flex-direction: column;
      padding: 0;
      width: 388px;

      .creative-image {
        width: 372px;
        height: 124px;
      }
      .creative-text {
        padding: 0 7px;
      }
    }
  }
}
.pic-sets {
  &.pc-preview {
    .creative-con {
      width: 300px;

      .creative-image-wrapper {
        flex-wrap: wrap;
        gap: 4px;
      }
      .creative-image {
        width: 140px;
        height: 79px;
      }
      .creative-text {
        padding: 0 7px;
      }
    }
  }
  &.wap-preview {
    .title {
      font-size: 16px;
    }
    .creative-con {
      flex-wrap: wrap;
      padding: 0;
      width: 350px;
      background: unset;

      .creative-image-wrapper {
        gap: 4px;
      }
      .creative-image {
        width: 108px;
        height: 108px;
      }
      .creative-text {
        padding: 0 7px;
      }
    }
  }
}
</style>
