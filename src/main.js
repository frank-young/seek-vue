import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import goods from 'components/goods/goods'
import ratings from 'components/ratings/ratings'
import seller from 'components/seller/seller'
import pay from 'components/pay/pay'
import watingpay from 'components/watingpay/watingpay'

Vue.use(VueRouter)
Vue.use(VueResource)

const routes = [
  {path: '/goods', component: goods, name: '商品'},
  {path: '/ratings', component: ratings, name: '评价'},
  {path: '/seller', component: seller, name: '商家'},
  {path: '/pay', component: pay, name: '在线支付'},
  {path: '/watingpay', component: watingpay, name: '等待支付'}
]

const router = new VueRouter({
  routes,
  linkActiveClass: 'active'
})

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

router.push('goods')
