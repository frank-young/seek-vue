<template>
  <div>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/start">
          <img src="./img/start.png" alt="">
          <span>点餐</span>
        </router-link>
      </div>
      <div class="tab-item">
        <router-link to="/order">
          <img src="./img/order.png" alt="">
          <span>订单</span>
        </router-link>
      </div>
    </div>
    <router-view :seller="seller"></router-view>
  </div>
</template>

<script>
import Vue from 'vue'

const ERR_OK = 0

export default {
    data() {
        return {
            seller: {}
        }
    },
    created() {
        this.$http.get('/api/seller').then((res) => {
            res = res.body
            if (res.errno === ERR_OK) {
                this.seller = res.data
            }
        })
    },
    components: {
    }
}

Vue.filter('currency', (value) => {
    return Number(value).toFixed(2)
})

Vue.filter('date', (value) => {
  let date = new Date(value)
  let y = date.getFullYear()
  let m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
  let d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  let H = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  let M = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()

  return y + '-' + m + '-' + d + ' ' + H + ':' + M
})

</script>

<style lang="less">
  @import './common/less/base.less';

  .tab{
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 15;
    display: flex;
    width: 100%;
    height: 58px;
    line-height: 40px;
    font-size: 16px;
    color: @text;
    background-color: #fefefe;
    &:before {
      content: '';
      position: absolute;
      width: 100%;
      height: 1px;
      background-color: #eee;
      transform: scale(1,0.5);
    }
    &:after{
      content: '';
      .pos(a);
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: @line;
      .scale(1,.5);
    }
    .tab-item{
      flex:1;
      text-align: center;
      a{
        .ds(b);
        position: relative;
        height: 58px;
        &.active{
          color: @red;
        }
        img {
          width: 32px;
          position: absolute;
          display: block;
          top: 8px;
          left: 50%;
          font-size: 10px;
          line-height: 10px;
          -webkit-transform: translate(-50%, 0);
          transform: translate(-50%, 0);
        }
        span {
          position: absolute;
          display: block;
          bottom: 8px;
          left: 50%;
          font-size: 10px;
          line-height: 10px;
          -webkit-transform: translate(-50%, 0);
          transform: translate(-50%, 0);
        }
      }
    }
  }
</style>







