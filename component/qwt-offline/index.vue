<template>
    <main class="offline-container">
        <p>尊敬的用户,</p>
        <p>搜索通系统维护中，维护时间：<b>2021年6月7日（周一）20:00-6月8日08:00,</b></p>
        <p>维护完毕后可以正常访问当前页面，请耐心等待。</p>
    </main>
</template>

<script>

export default {
  name: 'qwtOffline'
}
</script>

<style lang="scss" scoped>
    .offline-container{
        margin: 20px;
        border-radius: 4px;
        box-shadow: 0 2px 9px 0 rgba(83, 95, 127, .10);
        color: #666;
        font-size: 18px;
        height: inherit;
        padding-top: 14%;
        background: url('https://file.baixing.net/c3a9c381-7ee2-4527-8f59-1877ec81762e.gif') no-repeat right/25%, #ffffff;
        p{
            margin: 0;
            padding-left: 10%;
            b{
                color: #ff4d4d;
            }
        }
    }
</style>
