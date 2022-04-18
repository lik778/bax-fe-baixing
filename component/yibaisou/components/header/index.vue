<template>
    <header>
        <div class="wrapper">
            <h1>易百搜</h1>
            <div>{{userInfo.name || '我是小小百姓'}}</div>
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
        background-image: linear-gradient(-179deg, #ff4d4d 0%, #ff8955 100%);
        box-shadow: 0 2px 9px 0 rgba(83, 95, 127, 0.1);
        .wrapper{
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 30px;
            box-sizing: border-box;
            h1{
                color: #fff;
                font-size: 24px;
            }
        }
    }
</style>
