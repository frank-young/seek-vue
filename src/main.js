import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import goods from 'components/goods/goods'
import ratings from 'components/ratings/ratings'
import seller from 'components/seller/seller'
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
  {path: '/seller', component: seller, name: 'seller'},
  {path: '/pay/:id', component: pay, name: 'pay'},
  {path: '/watingpay/:id', component: watingpay, name: 'watingpay'},
  {path: '/success', component: success, name: 'success'},
  {path: '/order/detail/:id', component: orderdetail, name: 'orderdetail'},
  {path: '/order/cancel/:id', component: ordercancel, name: 'ordercancel'},
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

router.push('goods')
