<template>
  <div>
    <v-header v-bind:seller="seller"></v-header>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import header from 'components/header/header'

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
        'v-header': header
    }
}
</script>

<style lang="less">
  @import './common/less/base.less';

  .tab{
    .pos(r);
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: @f16;
    color: @text;
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
        &.active{
          color: @red;
        }
      }
    }
  }
</style>
