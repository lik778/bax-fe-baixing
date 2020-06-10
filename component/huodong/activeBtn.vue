<template>
  <a class='active-btn'
     target='_blank'
     :href="href">立即抢购
    <img src='//file.baixing.net/202006/41fe238498b3d44d53d9ac115f19dbb9.png'
         alt='三角形' />
  </a>
</template>

<script>
export default {
  name: 'ActiveBtn',
  props: {
    href: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="postcss" scoped>
.active-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 223px;
  height: 44px;
  line-height: 44px;
  margin: 40px auto 0;
  text-align: center;
  background-image: linear-gradient(
    -36deg,
    #ffce46 0%,
    #e30c8d 100%,
    #e30c8d 100%
  );
  box-shadow: 0 2px 11px 0 rgba(255, 29, 106, 0.6);
  border-radius: 26px;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  text-decoration: none;
  & > img {
    width: 12px;
    margin-left: 10px;
  }
}
</style>
