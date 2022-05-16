<template>
    <header>
        <div class="wrapper">
            <span class="yi-baisou-logo"></span>
            <span class="user-logo"><i class="el-icon-user-solid"></i>{{userInfo.name || '我是小小百姓'}}</span>
        </div>
    </header>
</template>

<script>
export default {
  name: 'Header',
  props: {
    userInfo: {
      type: Object,
      require: true,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
    header{
        position: fixed;
        z-index: 998;
        display: flex;
        align-items: center;
        top: 0;
        left: 0;
        width: 100%;
        height: 50px;
        background: #151515;
        box-shadow: 0 2px 9px 0 rgba(83, 95, 127, 0.1);
        .wrapper{
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 30px;
            box-sizing: border-box;
            .yi-baisou-logo{
                width: 113px;
                height: 47px;
                background: url(../../assets/images/yi-baisou-logo.png) no-repeat center/cover;
            }
            .user-logo{
                color: #fff;
                i{
                    margin-right: 6px;
                }
            }
        }
    }
</style>
