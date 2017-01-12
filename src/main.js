import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import goods from 'components/goods/goods'
import ratings from 'components/ratings/ratings'
import start from 'components/start/start'
import pay from 'components/pay/pay'
import watingpay from 'components/watingpay/watingpay'
import success from 'components/success/success'
import orderdetail from 'components/order/orderdetail'
import ordercancel from 'components/order/ordercancel'
import order from 'components/order/order'

Vue.use(VueRouter)
Vue.use(VueResource)

const routes = [
  {path: '/goods', component: goods, name: 'goods'},
  {path: '/ratings', component: ratings, name: 'ratings'},
  {path: '/start', component: start, name: 'start'},
  {path: '/pay/paydetail', component: pay, name: 'pay'},
  {path: '/watingpay', component: watingpay, name: 'watingpay'},
  {path: '/success', component: success, name: 'success'},
  {path: '/order/detail', component: orderdetail, name: 'orderdetail'},
  {path: '/order/cancel', component: ordercancel, name: 'ordercancel'},
  {path: '/order', component: order, name: 'order'}
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

router.push('start')
